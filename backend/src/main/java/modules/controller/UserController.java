package modules.controller;

import modules.dto.request.CreateUserRequest;
import modules.entity.User;
import modules.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable String id) {
        return service.findById(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable String id, @RequestBody CreateUserRequest request) {
        try {
            User updatedUser = service.update(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}