package modules.controller;

import modules.entity.Address;
import modules.entity.User;
import modules.service.UserService;
import modules.dto.request.CreateUserRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${FRONTEND_URL}")
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
        if (added == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        return ResponseEntity.ok(added);
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<?> deleteAddress(
            @PathVariable String userId,
            @PathVariable String addressId
    ) {
        try {
            boolean deleted = service.deleteAddress(userId, addressId);

            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("❌ Không tìm thấy địa chỉ để xóa!");
            }

            return ResponseEntity.ok("✅ Đã xóa địa chỉ thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Lỗi khi xóa địa chỉ: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable String userId,
            @PathVariable String addressId,
            @RequestBody Address updatedAddress
    ) {
        Address edited = service.updateAddress(userId, addressId, updatedAddress);
        if (edited == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        return ResponseEntity.ok(edited);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(
            @PathVariable String id,
            @RequestBody CreateUserRequest request
    ) {
        try {
            User updatedUser = service.update(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @PutMapping("/{userId}/addresses/{addressId}/default")
    public ResponseEntity<Address> setDefaultAddress(
            @PathVariable String userId,
            @PathVariable String addressId
    ) {
        try {
            Address updated = service.setDefaultAddress(userId, addressId);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
