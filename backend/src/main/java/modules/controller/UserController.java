package modules.controller;

import modules.entity.User;
import modules.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173" , allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Kiểm tra username đã tồn tại chưa
        Optional<User> existingUsername = userRepository.findByUsername(user.getUsername());
        if (existingUsername.isPresent()) {
            return ResponseEntity.badRequest().body(new Response("Username already exists!"));
        }

        // Kiểm tra email đã tồn tại chưa
        Optional<User> existingEmail = userRepository.findByEmail(user.getEmail());
        if (existingEmail.isPresent()) {
            return ResponseEntity.badRequest().body(new Response("Email already exists!"));
        }

        // Hash mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(Instant.now());
        user.setFullName(user.getFirstName() + " " + user.getLastName());

        // Lưu
        userRepository.save(user);
        return ResponseEntity.ok(new Response("User registered successfully!"));
    }

    record Response(String message) {}
}