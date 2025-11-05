package modules.controller;

import modules.entity.Address;
import modules.entity.User;
import modules.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import modules.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import modules.dto.request.CreateUserRequest;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
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

    @PostMapping("/{userId}/addresses")
    public ResponseEntity<Address> addAddress(@PathVariable String userId, @RequestBody Address address) {
        Address added = service.addAddress(userId, address);
        if (added == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        return ResponseEntity.ok(added);
    }
    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable String userId, @PathVariable String addressId) {
        boolean deleted = service.deleteAddress(userId, addressId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable String userId,
            @PathVariable String addressId,
            @RequestBody Address updatedAddress) {

        Address edited = service.updateAddress(userId, addressId, updatedAddress);

        if (edited == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(edited);
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable String id, @RequestBody CreateUserRequest request) {
        try {
            // Sử dụng phương thức update đã có trong UserServiceImpl
            User updatedUser = service.update(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            // Xử lý trường hợp không tìm thấy user
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}