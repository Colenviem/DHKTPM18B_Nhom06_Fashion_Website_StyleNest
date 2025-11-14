package modules.service;

import modules.dto.request.*;
import modules.entity.Account;
import modules.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface AccountService extends UserDetailsService {

    Map<String, Object> createAccount(CreateUserRequest request);
    Map<String, Object> login(LoginRequest request);
    Map<String, Object> verifyCode(String email, String code);
    Map<String, Object> forgotPassword(ForgotPasswordRequest request);
    Map<String, Object> resetPassword(ResetPasswordRequest request);
    List<Account> findAll();
    Account findById(String id);
    Account createAccountByAdmin(AccountUserRequest.AccountDTO dto, String userId);
    Account updateAccountByAdmin(String accountId, AccountUserRequest.AccountDTO dto, String userId);
}
