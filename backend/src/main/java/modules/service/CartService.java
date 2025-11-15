package modules.service;

import modules.entity.Cart;
import modules.entity.ProductRef;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CartService {
    List<Cart> findAll();

    Cart findById(String id);

    Cart findByUserId(String userId);

    boolean deleteById(String id);

    Cart updateCartByUser(String userId, Cart cart);

    Cart save(Cart cart);

    Cart addProductToCart(String userId, String userName, ProductRef product, int quantity);
}
