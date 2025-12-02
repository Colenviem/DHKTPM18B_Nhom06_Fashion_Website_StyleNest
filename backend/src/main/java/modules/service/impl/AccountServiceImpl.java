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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AccountServiceImpl implements AccountService, UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RabbitTemplate rabbitTemplate;
    private final UserService userService;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AccountServiceImpl(AccountRepository accountRepository,
                              UserRepository userRepository,
                              PasswordEncoder passwordEncoder,
                              JwtUtil jwtUtil,
                              RabbitTemplate rabbitTemplate,
                              UserService userService,
                              EmailService emailService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.rabbitTemplate = rabbitTemplate;
        this.userService = userService;
        this.emailService = emailService;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + username));
    }

    @Override
    @Transactional
    public Map<String, Object> createAccount(CreateUserRequest request) {
        logger.info("Tạo tài khoản cho email: {}", request.getEmail());

        if (accountRepository.findByUserName(request.getUserName()).isPresent()
                || userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc email đã tồn tại");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setAddresses(request.getAddresses());
        user.setCoupons(request.getCoupons());
        user.setCreatedAt(Instant.now());
        user = userRepository.save(user);

        String code = generateRandomCode(6);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        Account account = new Account();
        account.setUserName(request.getUserName());
        account.setPassWord(passwordEncoder.encode(request.getPassword()));
        account.setRole(request.getRole() != null ? request.getRole() : Role.CUSTOMER);
        account.setActive(false);
        account.setVerificationCode(code);
        account.setVerificationExpiry(expiry);
        account.setUserId(user.getId());
        accountRepository.save(account);

        sendVerificationEmail(request.getEmail(), code, "register");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mã xác minh đã được gửi");
        response.put("email", request.getEmail());
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> login(LoginRequest request) {
        logger.info("Đăng nhập với tài khoản: {}", request.getUserName());

        Account account = accountRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (!account.isActive() || !passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với email: " + email));

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));

        if (!account.getVerificationCode().equals(code)
                || LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            throw new IllegalArgumentException("Mã xác minh không hợp lệ hoặc đã hết hạn");
        }

        account.setActive(true);
        account.setVerificationCode(null);
        account.setVerificationExpiry(null);
        accountRepository.save(account);

        sendWelcomeNotification(user);

        String token = jwtUtil.generateToken(user.getEmail(), "ROLE_" + account.getRole().name(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("user", mapToUserResponse(user, account));
        response.put("token", token);
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));

        String code = generateRandomCode(6);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        account.setVerificationCode(code);
        account.setVerificationExpiry(expiry);
        accountRepository.save(account);

        sendVerificationEmail(request.getEmail(), code, "reset-password");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mã xác minh đã được gửi");
        response.put("email", request.getEmail());
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));

        if (account.getVerificationCode() == null ||
                !account.getVerificationCode().equals(request.getVerificationCode()) ||
                LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            throw new IllegalArgumentException("Mã xác minh không hợp lệ hoặc đã hết hạn");
        }

        account.setPassWord(passwordEncoder.encode(request.getNewPassword()));
        account.setVerificationCode(null);
        account.setVerificationExpiry(null);
        accountRepository.save(account);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đặt lại mật khẩu thành công");
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

    private void sendVerificationEmail(String email, String code, String type) {
        String subject = type.equals("register") ? "Xác minh tài khoản StyleNest" : "Đặt lại mật khẩu StyleNest";
        String title = type.equals("register") ? "Chào mừng bạn đến với StyleNest!" : "Đặt lại mật khẩu";
        String buttonText = type.equals("register") ? "Xác minh ngay" : "Đặt lại mật khẩu";
        String endpoint = type.equals("register") ? "/verify-email" : "/reset-password";
        String link = frontendUrl + endpoint + "?email=" + email + "&code=" + code;

        String htmlContent = """
        <!DOCTYPE html>
        <html lang="vi">
        <body>
            <h2>%s</h2>
            <p>Mã xác minh của bạn là:</p>
            <h1>%s</h1>
            <a href="%s">%s</a>
            <p>Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email.</p>
        </body>
        </html>
        """;

        String finalHtml = htmlContent.formatted(title, code, link, buttonText);
        emailService.sendEmail(email, subject, finalHtml);
    }

    private void sendWelcomeNotification(User user) {
        try {
            NotificationMessage message = new NotificationMessage();
            message.setUserId(user.getId());
            message.setMessage("Chào mừng " + user.getFirstName() + " đã tham gia StyleNest!");
            message.setType("THÔNG_BÁO_CHÀO_MỪNG");

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
            logger.error("Không thể gửi thông báo chào mừng: {}", e.getMessage());
        }
    }

    private UserResponse mapToUserResponse(User user, Account account) {
        UserResponse response = new UserResponse();
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
        account.setPassWord(passwordEncoder.encode("123456"));
        return accountRepository.save(account);
    }

    public Account updateAccountByAdmin(String accountId, AccountUserRequest.AccountDTO dto, String userId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        account.setUserName(dto.getUsername());
        account.setRole(Role.valueOf(dto.getRole()));
        account.setActive(dto.isActive());
        account.setUserId(userId);
        return accountRepository.save(account);
    }

    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
}
