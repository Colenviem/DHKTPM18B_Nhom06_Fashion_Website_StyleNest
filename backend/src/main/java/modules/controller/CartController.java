package modules.controller;

import modules.entity.Cart;
import modules.service.impl.CartServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {
    private final CartServiceImpl service;

    public CartController(CartServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public List<Cart> getAllCarts() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Cart findById(@PathVariable String id) {
        return service.findById(id);
    }

    // Lấy cart theo userId
    @GetMapping("/user/{userId}")
    public Cart getCartByUser(@PathVariable String userId) {
        return service.findByUserId(userId);
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<Cart> updateCartByUser(
            @PathVariable String userId,
            @RequestBody Cart cart) {
        Cart existingCart = service.findByUserId(userId);
        if (existingCart == null) return ResponseEntity.notFound().build();

        existingCart.setItems(cart.getItems());
        existingCart.setTotalQuantity(cart.getTotalQuantity());
        existingCart.setTotalPrice(cart.getTotalPrice());

        Cart updatedCart = service.save(existingCart);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable String id) {
        Cart cart = service.findById(id);
        if (cart == null) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
