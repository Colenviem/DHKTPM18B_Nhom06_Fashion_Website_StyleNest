package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.service.LoginHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login-history")
@CrossOrigin(origins = "${FRONTEND_URL}")
@RequiredArgsConstructor
public class LoginHistoryController {

    private final LoginHistoryService service;

    // Ghi lại login của CUSTOMER
    @PostMapping("/customer/{username}")
    public Object saveCustomerLogin(@PathVariable String username) {
        return service.saveCustomerLogin(username);
    }

    // Thống kê hôm nay
    @GetMapping("/stats/today")
    public List<Object> getTodayStats() {
        return service.getTodayLoginStats();
    }

    // Thống kê hôm qua
    @GetMapping("/stats/yesterday")
    public List<Object> getYesterdayStats() {
        return service.getYesterdayLoginStats();
    }
}
