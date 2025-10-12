package modules.controller;

import jakarta.servlet.http.HttpSession;
import modules.entity.User;
import modules.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLogin login, HttpSession session) {
        Optional<User> user = userService.login(login.getUsername(), login.getPassword());
        if (!user.isPresent()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        // Lưu user vào session
        session.setAttribute("user", user.get());
        return ResponseEntity.ok("Login successful");
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> currentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body("No active session");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
}

class UserLogin {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
