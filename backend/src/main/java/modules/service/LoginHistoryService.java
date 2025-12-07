package modules.service;

import lombok.RequiredArgsConstructor;
import modules.entity.LoginHistory;
import modules.entity.Role;
import modules.repository.LoginHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginHistoryService {

    private final LoginHistoryRepository repository;

    // Ghi lại lịch sử đăng nhập (chỉ CUSTOMER)
    public LoginHistory saveCustomerLogin(String username) {
        LoginHistory history = new LoginHistory(
                username,
                LocalDateTime.now(),
                Role.CUSTOMER
        );
        return repository.save(history);
    }

    // Trả về số lượt truy cập hôm nay, nhóm theo username
    public List<Object> getTodayLoginStats() {
        LocalDateTime start = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime end   = LocalDateTime.now().with(LocalTime.MAX);
        return repository.countLoginByUsername(start, end);
    }

    // Trả về số lượt truy cập hôm qua, nhóm theo username
    public List<Object> getYesterdayLoginStats() {
        LocalDateTime start = LocalDateTime.now().minusDays(1).with(LocalTime.MIN);
        LocalDateTime end   = LocalDateTime.now().minusDays(1).with(LocalTime.MAX);
        return repository.countLoginByUsername(start, end);
    }
}
