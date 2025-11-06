package modules.service;

import modules.dto.request.CreateUserRequest;
import modules.dto.request.ForgotPasswordRequest;
import modules.dto.request.LoginRequest;
import modules.dto.request.ResetPasswordRequest;
import modules.entity.Account;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;
import java.util.Map;


public interface AccountService extends UserDetailsService {

    Map<String, Object> createAccount(CreateUserRequest request);
    Map<String, Object> login(LoginRequest request);
    Map<String, Object> verifyCode(String email, String code);
    Map<String, Object> forgotPassword(ForgotPasswordRequest request);
    Map<String, Object> resetPassword(ResetPasswordRequest request);
    List<Account> findAll();
    Account findById(String id);
}
