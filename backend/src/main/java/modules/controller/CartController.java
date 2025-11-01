package modules.controller;

import modules.entity.Cart;
import modules.entity.Product;
import modules.entity.ProductRef;
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
            @RequestBody Cart incomingCart) {

        Cart existingCart = service.findByUserId(userId);
        if (existingCart == null) return ResponseEntity.notFound().build();

        if (incomingCart.getItems() != null) {
            existingCart.getItems().clear();
            for (var item : incomingCart.getItems()) {
                if (item.getProduct() != null && item.getProduct().getId() != null) {
                    ProductRef p = new ProductRef();
                    p.setId(item.getProduct().getId());
                    p.setName(item.getProduct().getName());
                    p.setImage(item.getProduct().getImage());
                    p.setPrice(item.getProduct().getPrice());
                    p.setDiscount(item.getProduct().getDiscount());
                    item.setProduct(p);
                } else {
                    item.setProduct(new ProductRef());
                }
                existingCart.getItems().add(item);
            }
        }

        existingCart.setTotalQuantity(incomingCart.getTotalQuantity());
        existingCart.setTotalPrice(incomingCart.getTotalPrice());

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
