package modules.service;

import modules.entity.Account;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface AccountService extends UserDetailsService {

    public List<Account> findAll();

    public Account findById(String id);
}
