package modules.service.impl;

import modules.entity.LoginHistory;
import modules.entity.Role;
import modules.repository.LoginHistoryRepository;
import modules.service.LoginHistoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
@Service
public class LoginHistoryImpl implements LoginHistoryService {
    private final LoginHistoryRepository repository;

    public LoginHistoryImpl(LoginHistoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public LoginHistory saveCustomerLogin(String username) {
        LoginHistory history = new LoginHistory(
                username,
                LocalDateTime.now(),
                Role.CUSTOMER
        );
        return repository.save(history);
    }

    @Override
    public List<Object> getTodayLoginStats() {
        LocalDateTime start = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime end   = LocalDateTime.now().with(LocalTime.MAX);
        return repository.countLoginByUsername(start, end);
    }

    @Override
    public List<Object> getYesterdayLoginStats() {
        LocalDateTime start = LocalDateTime.now().minusDays(1).with(LocalTime.MIN);
        LocalDateTime end   = LocalDateTime.now().minusDays(1).with(LocalTime.MAX);
        return repository.countLoginByUsername(start, end);
    }
}
