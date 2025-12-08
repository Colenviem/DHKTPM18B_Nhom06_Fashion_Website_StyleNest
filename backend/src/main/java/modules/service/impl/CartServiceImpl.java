package modules.service.impl;

import modules.entity.Cart;
import modules.entity.CartItem;
import modules.entity.ProductRef;
import modules.entity.UserRef;
import modules.repository.CartRepository;
import modules.service.CartService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository repository;

    public CartServiceImpl(CartRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Cart> findAll() {
        return repository.findAll();
    }

    @Override
    public Cart findById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Cart findByUserId(String userId) {
        return repository.findByUserId(userId).orElse(null);
    }

    @Override
    public Cart save(Cart cart) {
        return repository.save(cart);
    }

    @Override
    public Cart updateCartByUser(String userId, Cart incomingCart) {
        Cart existing = repository.findByUserId(userId).orElse(null);

        // Nếu chưa có giỏ hàng thì TẠO MỚI LUÔN
        if (existing == null) {
            existing = new Cart();
            UserRef userRef = new UserRef();
            userRef.setId(userId);
            existing.setUser(userRef);
            existing.setItems(new ArrayList<>());
            existing.setTotalQuantity(0);
            existing.setTotalPrice(0);
        }

        // Xóa items cũ
        existing.getItems().clear();

        // Thêm items từ incomingCart
        Cart existingFinal = existing;
        incomingCart.getItems().forEach(item -> {
            existingFinal.getItems().add(item);
        });

        existing.setTotalQuantity(
                existing.getItems().stream().mapToInt(CartItem::getQuantity).sum()
        );

        existing.setTotalPrice(
                existing.getItems().stream()
                        .mapToDouble(item -> item.getPriceAtTime() * item.getQuantity())
                        .sum()
        );

        return repository.save(existing);
    }


    @Override
    public boolean deleteById(String id) {
        return repository.findById(id)
                .map(cart -> {
                    repository.delete(cart);
                    return true;
                }).orElse(false);
    }

    @Override
    public Cart addProductToCart(String userId, String userName, ProductRef product, int quantity) {
        if (userId == null || product == null) return null;

        Cart cart = repository.findByUserId(userId).orElse(null);

        if (cart == null) {
            cart = new Cart();
            cart.setUser(new modules.entity.UserRef(userId, userName));
            cart.setItems(new java.util.ArrayList<>());
            cart.setTotalQuantity(0);
            cart.setTotalPrice(0);
        }

        boolean found = false;
        for (var item : cart.getItems()) {
            if (item.getProduct().getId().equals(product.getId())) {
                item.setQuantity(item.getQuantity() + quantity);
                found = true;
                break;
            }
        }

        if (!found) {
            var cartItem = new modules.entity.CartItem(product, quantity, product.getPrice());
            cart.getItems().add(cartItem);
        }

        int totalQty = 0;
        double totalPrice = 0;
        for (var item : cart.getItems()) {
            totalQty += item.getQuantity();
            totalPrice += item.getQuantity() * item.getPriceAtTime();
        }
        cart.setTotalQuantity(totalQty);
        cart.setTotalPrice(totalPrice);

        return repository.save(cart);
    }


}
