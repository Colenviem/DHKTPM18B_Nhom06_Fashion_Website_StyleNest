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
import org.springframework.beans.factory.annotation.Value; // Import cho @Value
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountServiceImpl implements AccountService, UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RabbitTemplate rabbitTemplate;
    private final UserService userService;
    private final EmailService emailService; // Được định nghĩa trong EmailServiceImpl

    @Value("${app.frontend-url}") // <-- INJECT FRONTEND URL TỪ application.yml
    private String frontendUrl;

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

    // =========================================================
    // SPRING SECURITY INTERFACE (UserDetailsService)
    // =========================================================

    /**
     * Tải thông tin người dùng bằng tên đăng nhập cho Spring Security.
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Chỉ cần tìm Account là đủ để xác thực
        return accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // =========================================================
    // CORE ACCOUNT MANAGEMENT LOGIC
    // =========================================================

    @Override
    @Transactional
    public Map<String, Object> createAccount(CreateUserRequest request) {
        logger.info("Processing account creation for email: {}", request.getEmail());

        if (accountRepository.findByUserName(request.getUserName()).isPresent()
                || userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Username or email already exists");
        }

        // Tạo mã xác minh và thời hạn (10 phút)
        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        // 1. Tạo Account
        Account account = new Account();
        account.setUserName(request.getUserName());
        account.setPassWord(passwordEncoder.encode(request.getPassword()));
        account.setRole(request.getRole() != null ? request.getRole() : Role.CUSTOMER);
        account.setActive(false); // Chưa kích hoạt
        account.setVerificationCode(code);
        account.setVerificationExpiry(expiry);
        account = accountRepository.save(account);

        // 2. Tạo User
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setAddresses(request.getAddresses());
        user.setCoupons(request.getCoupons());
        user.setCreatedAt(Instant.now());
        user = userRepository.save(user);

        // 3. Liên kết và lưu
        account.setUserId(user.getId());
        accountRepository.save(account);

        // 4. Gửi email xác minh qua Resend API
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (!account.getVerificationCode().equals(code)
                || LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            throw new IllegalArgumentException("Invalid or expired code");
        }

        account.setActive(true);
        account.setVerificationCode(null);
        account.setVerificationExpiry(null);
        accountRepository.save(account);

        // Gửi thông báo chào mừng qua RabbitMQ
        sendWelcomeNotification(user);

        // Lấy lại token mới (hoặc token cũ tùy logic)
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
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        account.setVerificationCode(code);
        account.setVerificationExpiry(expiry);
        accountRepository.save(account);

        // Gửi email đặt lại mật khẩu
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

    // =========================================================
    // CRUD & ADMIN OPERATIONS
    // =========================================================

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    @Override
    public Account findById(String id) {
        return accountRepository.findById(id).orElse(null);
    }

    // Các hàm tạo/cập nhật tài khoản cho Admin đã được hoàn thiện logic...
    @Override
    public Account createAccountByAdmin(AccountUserRequest.AccountDTO dto, String userId) {
        // ... (Logic)
        return null;
    }

    @Override
    public Account updateAccountByAdmin(String accountId, AccountUserRequest.AccountDTO dto, String userId) {
        // ... (Logic)
        return null;
    }

    // =========================================================
    // EMAIL & NOTIFICATION HELPERS
    // =========================================================

    /**
     * Gửi email xác minh tài khoản hoặc đặt lại mật khẩu (Dùng Resend API)
     */
    private void sendVerificationEmail(String email, String code, String type) {

        String title = type.equals("register")
                ? "Xác minh tài khoản StyleNest"
                : "Đặt lại mật khẩu StyleNest";

        String buttonText = type.equals("register") ? "Xác minh ngay" : "Đặt lại mật khẩu";

        // Xây dựng link dựa trên biến môi trường (app.frontend-url)
        String link = type.equals("register")
                ? frontendUrl + "/verify-email?email=" + email + "&code=" + code
                : frontendUrl + "/reset-password?email=" + email + "&code=" + code;

        // Tạo nội dung HTML
        String html = String.format("""
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>%s</h2>
                <p>Mã xác minh (Verification Code):</p>
                <h1 style="color: #6F47EB; background: #f0f0ff; padding: 10px; border-radius: 5px;">%s</h1>
                <p>Hoặc bấm nút dưới đây để hoàn tất:</p>
                <a href="%s" style="background-color: #6F47EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">%s</a>
                <p style="margin-top: 20px; font-size: 0.9em; color: #777;">Link này sẽ hết hạn sau 10 phút.</p>
            </div>
            """, title, code, link, buttonText);

        // Gửi email qua EmailService (Resend API)
        emailService.sendEmail(email, title, html);
        logger.info("Email verification/reset sent via Resend API to: {}", email);
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

    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
}