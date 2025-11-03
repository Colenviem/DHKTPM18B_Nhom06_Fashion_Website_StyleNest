package modules.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import modules.config.RabbitMQConfig;
import modules.dto.message.NotificationMessage;
import modules.dto.request.CreateUserRequest;
import modules.dto.request.ForgotPasswordRequest;
import modules.dto.request.LoginRequest;
import modules.dto.request.ResetPasswordRequest;
import modules.dto.response.UserResponse;
import modules.entity.Account;
import modules.entity.Role;
import modules.entity.User;
import modules.repository.AccountRepository;
import modules.repository.UserRepository;
import modules.service.AccountService;
import modules.service.UserService;
import modules.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Đây là lớp Implementation (triển khai) cho AccountService.
 * Nó chứa toàn bộ logic nghiệp vụ.
 */
@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository  userRepository;

    public AccountServiceImpl(AccountRepository repository, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }
    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    // Gộp tất cả dependencies từ cả 2 file cũ vào đây
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;
    private final RabbitTemplate rabbitTemplate;
    private final UserService userService;

    // Constructor với tất cả dependencies
    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository,
                              PasswordEncoder passwordEncoder, JwtUtil jwtUtil, JavaMailSender mailSender,
                              RabbitTemplate rabbitTemplate, UserService userService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
        this.rabbitTemplate = rabbitTemplate;
        this.userService = userService;
    }

    // --- Triển khai các phương thức từ Interface ---

    @Override
    @Transactional
    public Map<String, Object> createAccount(CreateUserRequest request) {
        logger.info("Processing account creation for email: {}", request.getEmail());

        if (accountRepository.findByUserName(request.getUserName()).isPresent() ||
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Username {} or email {} exists", request.getUserName(), request.getEmail());
            throw new IllegalArgumentException("Username or email already exists");
        }

        validatePassword(request.getPassword());

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
                .orElseThrow(() -> {
                    logger.warn("Username not found: {}", request.getUserName());
                    throw new RuntimeException("Invalid username or password");
                });

        if (!account.isActive() || !passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            logger.warn("Invalid credentials for username: {}", request.getUserName());
            throw new RuntimeException("Invalid username or password");
        }

        User user = userService.findById(account.getUserId());
        String token = jwtUtil.generateToken(user.getEmail(), "ROLE_" + account.getRole().name(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("user", mapToUserResponse(user, account));
        response.put("token", token);

        logger.info("User {} logged in successfully", request.getUserName());
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> verifyCode(String email, String code) {
        logger.info("Verifying code for email: {}", email);

        Account account = accountRepository.findByUserId(userRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("User not found")).getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (!account.getVerificationCode().equals(code) || LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            logger.warn("Invalid or expired code for email: {}", email);
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
        logger.info("Processing forgot password for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Email not found: {}", request.getEmail());
                    throw new IllegalArgumentException("Email not found");
                });

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
        logger.info("Processing reset password for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (!account.getVerificationCode().equals(request.getVerificationCode()) ||
                LocalDateTime.now().isAfter(account.getVerificationExpiry())) {
            logger.warn("Invalid or expired code for email: {}", request.getEmail());
            throw new IllegalArgumentException("Invalid or expired code");
        }

        validatePassword(request.getNewPassword());
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


    /**
     * Đây là phương thức triển khai từ UserDetailsService (Spring Security).
     * Nó được Spring Security gọi khi xác thực người dùng.
     * Tôi giả định repository của bạn có phương thức 'findByUserName'.
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // --- Các phương thức private (helper) ---

    private void validatePassword(String password) {
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!password.matches(passwordPattern)) {
            throw new IllegalArgumentException("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }
    }

    private void sendVerificationEmail(String email, String code, String type) {
        logger.info("Preparing to send verification email to {}", email);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setFrom("StyleNest <trancongtinh20042004@gmail.com>");
            helper.setSubject(type.equals("register") ? "Xác minh tài khoản StyleNest" : "Đặt lại mật khẩu StyleNest");

            String title = type.equals("register") ? "Chào mừng bạn đến với StyleNest!" : "Đặt lại mật khẩu của bạn";
            String buttonText = type.equals("register") ? "Xác minh ngay" : "Đặt lại mật khẩu";
            String link = "https://stylenest.vercel.app/verify?email=" + email + "&code=" + code;

            String htmlContent = """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 30px;">
                <table width="100%%" style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                    <tr>
                        <td style="background-color: #111827; color: white; text-align: center; padding: 20px 0;">
                            <h2 style="margin: 0;">🛍️ StyleNest</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h3 style="color: #333333;">%s</h3>
                            <p style="font-size: 15px; color: #555;">
                                Xin chào <b>%s</b>,<br><br>
                                Mã xác minh của bạn là:
                            </p>
                            <div style="text-align: center; margin: 20px 0;">
                                <div style="display: inline-block; font-size: 22px; font-weight: bold; color: #111827; border: 2px dashed #111827; padding: 12px 30px; border-radius: 8px; letter-spacing: 4px;">
                                    %s
                                </div>
                            </div>
                            <p style="font-size: 15px; color: #555;">Hoặc bạn có thể bấm vào nút bên dưới để tiếp tục:</p>
                            <div style="text-align: center; margin: 25px;">
                                <a href="%s" style="background-color: #111827; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;">
                                    %s
                                </a>
                            </div>
                            <p style="font-size: 13px; color: #777;">
                                Mã xác minh có hiệu lực trong 10 phút. Nếu bạn không yêu cầu hành động này, vui lòng bỏ qua email này.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #888;">
                            © 2025 StyleNest. All rights reserved.
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(title, email, code, link, buttonText);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("Verification email sent successfully to {}", email);

        } catch (MailException e) {
            logger.error("MailException when sending to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to send email (MailException): " + e.getMessage(), e);
        } catch (MessagingException e) {
            logger.error("MessagingException when creating email for {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to create email message: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while sending email to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Unexpected error while sending email: " + e.getMessage(), e);
        }
    }

    private void sendWelcomeNotification(User user) {
        try {
            NotificationMessage message = new NotificationMessage();
            message.setUserId(user.getId());
            message.setMessage("Welcome " + user.getFirstName() + " to our service!");
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
            logger.info("Sent welcome notification for user: {}", user.getId());
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
}