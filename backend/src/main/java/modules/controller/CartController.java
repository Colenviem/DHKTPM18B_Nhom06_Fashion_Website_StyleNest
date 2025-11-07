package modules.controller;

import modules.entity.Cart;
import modules.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getAllCarts() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> findById(@PathVariable String id) {
        Cart cart = service.findById(id);
        return (cart != null) ? ResponseEntity.ok(cart) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getCartByUser(@PathVariable String userId) {
        Cart cart = service.findByUserId(userId);
        return (cart != null) ? ResponseEntity.ok(cart) : ResponseEntity.notFound().build();
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<Cart> updateCartByUser(
            @PathVariable String userId,
            @RequestBody Cart incomingCart) {

        Cart updated = service.updateCartByUser(userId, incomingCart);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable String id) {
        boolean deleted = service.deleteById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}