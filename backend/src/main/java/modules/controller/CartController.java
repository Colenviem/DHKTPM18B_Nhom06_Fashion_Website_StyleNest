package modules.controller;

import modules.entity.Cart;
import modules.entity.CartItem;
import modules.entity.UserRef;
import modules.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "${FRONTEND_URL}")
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
        if (cart == null) {
            cart = new Cart();
            UserRef user = new UserRef();
            user.setId(userId);
            cart.setUser(user);
            cart.setItems(Collections.emptyList());
            cart.setTotalQuantity(0);
            cart.setTotalPrice(0);
        }

        return ResponseEntity.ok(cart);
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
    @PostMapping("/user/{userId}/add")
    public ResponseEntity<Cart> addToCart(
            @PathVariable String userId,
            @RequestBody CartItem cartItem) {

        Cart cart = service.findByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            UserRef user = new UserRef();
            user.setId(userId);
            cart.setUser(user);
            cart.setItems(new ArrayList<>());
            cart.setTotalQuantity(0);
            cart.setTotalPrice(0);
        }

        boolean exists = false;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(cartItem.getProduct().getId())) {
                item.setQuantity(item.getQuantity() + cartItem.getQuantity());
                exists = true;
                break;
            }
        }
        if (!exists) {
            cart.getItems().add(cartItem);
        }

        int totalQty = cart.getItems().stream().mapToInt(CartItem::getQuantity).sum();
        double totalPrice = cart.getItems().stream()
                .mapToDouble(i -> i.getQuantity() * i.getPriceAtTime())
                .sum();
        cart.setTotalQuantity(totalQty);
        cart.setTotalPrice(totalPrice);

        Cart saved = service.save(cart);
        return ResponseEntity.ok(saved);
    }
}