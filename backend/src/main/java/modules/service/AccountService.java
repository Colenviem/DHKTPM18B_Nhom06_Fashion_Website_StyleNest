package modules.service;

import modules.dto.request.CreateUserRequest;
import modules.dto.request.ForgotPasswordRequest;
import modules.dto.request.LoginRequest;
import modules.dto.request.ResetPasswordRequest;
import modules.entity.Account;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;
import java.util.Map;

/**
 * Đây là file Interface (giao diện) cho AccountService.
 * Nó kế thừa UserDetailsService để Spring Security có thể sử dụng
 * phương thức loadUserByUsername.
 */
public interface AccountService extends UserDetailsService {

    /**
     * Tạo tài khoản mới và gửi email xác thực.
     */
    Map<String, Object> createAccount(CreateUserRequest request);

    /**
     * Đăng nhập và trả về thông tin user cùng JWT token.
     */
    Map<String, Object> login(LoginRequest request);

    /**
     * Xác thực mã code (từ email) để kích hoạt tài khoản hoặc reset mật khẩu.
     */
    Map<String, Object> verifyCode(String email, String code);

    /**
     * Gửi mã xác thực reset mật khẩu qua email.
     */
    Map<String, Object> forgotPassword(ForgotPasswordRequest request);

    /**
     * Đặt lại mật khẩu bằng mã xác thực.
     */
    Map<String, Object> resetPassword(ResetPasswordRequest request);

    /**
     * Lấy tất cả tài khoản.
     */
    List<Account> findAll();

    /**
     * Tìm tài khoản bằng ID.
     */
    Account findById(String id);

    // Phương thức loadUserByUsername(String username)
    // đã được kế thừa từ UserDetailsService
}
