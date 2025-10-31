package modules.controller;

import modules.entity.Cart;
import modules.service.impl.CartServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
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
}
