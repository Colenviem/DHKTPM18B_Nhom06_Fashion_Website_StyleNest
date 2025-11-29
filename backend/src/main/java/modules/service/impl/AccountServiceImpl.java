package modules.service.impl;

import modules.config.RabbitMQConfig;
import modules.dto.message.NotificationMessage;
import modules.dto.request.*;
import modules.dto.response.UserResponse;
import modules.entity.Account;
import modules.entity.Role;
import modules.entity.User;
import modules.repository.AccountRepository;
import modules.repository.UserRepository;
import modules.service.AccountService;
import modules.service.EmailService;
import modules.service.UserService;
import modules.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AccountServiceImpl implements AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RabbitTemplate rabbitTemplate;
    private final UserService userService;
    private final EmailService emailService;

    public AccountServiceImpl(
            AccountRepository accountRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            RabbitTemplate rabbitTemplate,
            UserService userService,
            EmailService emailService
    ) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.rabbitTemplate = rabbitTemplate;
        this.userService = userService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public Map<String, Object> createAccount(CreateUserRequest request) {
        logger.info("Processing account creation for email: {}", request.getEmail());

        if (accountRepository.findByUserName(request.getUserName()).isPresent()
                || userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Username or email already exists");
        }

        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        Account account = new Account();
        account.setUserName(request.getUserName());
        account.setPassWord(passwordEncoder.encode(request.getPassword()));
        account.setRole(request.getRole() != null ? request.getRole() : Role.CUSTOMER);
        account.setActive(false);
        account.setVerificationCode(code);
        account.setVerificationExpiry(expiry);
        account = accountRepository.save(account);

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setAddresses(request.getAddresses());
        user.setCoupons(request.getCoupons());
        user.setCreatedAt(Instant.now());
        user = userRepository.save(user);

        account.setUserId(user.getId());
        accountRepository.save(account);

        sendVerificationEmail(request.getEmail(), code, "register");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verification code sent");
        response.put("email", request.getEmail());
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> login(LoginRequest request) {
        logger.info("Attempting login for username: {}", request.getUserName());

        Account account = accountRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!account.isActive() || !passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        User user = userService.findById(account.getUserId());
        String token = jwtUtil.generateToken(user.getEmail(), "ROLE_" + account.getRole().name(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("user", mapToUserResponse(user, account));
        response.put("token", token);
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> verifyCode(String email, String code) {
        Account account = accountRepository.findByUserId(
                        userRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                                .getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (!account.getVerificationCode().equals(code)
                || LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            throw new IllegalArgumentException("Invalid or expired code");
        }

        account.setActive(true);
        account.setVerificationCode(null);
        account.setVerificationExpiry(null);
        accountRepository.save(account);

        User user = userRepository.findByEmail(email).get();
        String token = jwtUtil.generateToken(user.getEmail(), "ROLE_" + account.getRole().name(), user.getId());
        sendWelcomeNotification(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", mapToUserResponse(user, account));
        response.put("token", token);
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        account.setVerificationCode(code);
        account.setVerificationExpiry(expiry);
        accountRepository.save(account);

        sendVerificationEmail(request.getEmail(), code, "reset-password");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verification code sent");
        response.put("email", request.getEmail());
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (!request.getVerificationCode().equals(account.getVerificationCode())
                || LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            throw new IllegalArgumentException("Invalid or expired code");
        }

        account.setPassWord(passwordEncoder.encode(request.getNewPassword()));
        account.setVerificationCode(null);
        account.setVerificationExpiry(null);
        accountRepository.save(account);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password reset successfully");
        return response;
    }

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    @Override
    public Account findById(String id) {
        return accountRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // -------------------------------------------------------------------------
    // ---------------------- EMAIL VERIFICATION VIA RESEND ---------------------
    // -------------------------------------------------------------------------

    private void sendVerificationEmail(String email, String code, String type) {

        String title = type.equals("register")
                ? "Xác minh tài khoản StyleNest"
                : "Đặt lại mật khẩu StyleNest";

        String buttonText = type.equals("register") ? "Xác minh ngay" : "Đặt lại mật khẩu";

        String link = "http://localhost:5173/verify-email?email=" + email + "&code=" + code;

        String html = """
                <h2>%s</h2>
                <p>Mã xác minh của bạn là:</p>
                <h1>%s</h1>
                <p>Hoặc bấm nút dưới đây:</p>
                <a href="%s">%s</a>
                """.formatted(title, code, link, buttonText);

        emailService.sendEmail(email, title, html);
    }

    private void sendWelcomeNotification(User user) {
        try {
            NotificationMessage message = new NotificationMessage();
            message.setUserId(user.getId());
            message.setMessage("Welcome " + user.getFirstName() + "!");
            message.setType("WELCOME_MESSAGE");

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.NOTIFICATION_EXCHANGE,
                    RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                    message,
                    m -> {
                        m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                        return m;
                    }
            );
        } catch (Exception e) {
            logger.error("Failed to send welcome notification: {}", e.getMessage());
        }
    }

    private UserResponse mapToUserResponse(User user, Account account) {
        UserResponse response = new UserResponse();
        response.setId(account.getUserId());
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setAddresses(user.getAddresses());
        response.setCoupons(user.getCoupons());
        response.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt() : Instant.now());
        response.setUserName(account.getUsername());
        response.setRole(account.getRole() != null ? account.getRole().name() : "CUSTOMER");
        response.setActive(account.isActive());
        return response;
    }

    public Account createAccountByAdmin(AccountUserRequest.AccountDTO dto, String userId) {
        Account account = new Account();
        account.setUserName(dto.getUsername());
        account.setRole(Role.valueOf(dto.getRole()));
        account.setActive(dto.isActive());
        account.setUserId(userId);
        return accountRepository.save(account);
    }

    public Account updateAccountByAdmin(String accountId, AccountUserRequest.AccountDTO dto, String userId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account không tồn tại"));

        account.setUserName(dto.getUsername());
        account.setRole(Role.valueOf(dto.getRole()));
        account.setActive(dto.isActive());
        account.setUserId(userId);
        return accountRepository.save(account);
    }
}
