package modules.controller;

import modules.entity.Cart;
import modules.service.impl.CartServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
