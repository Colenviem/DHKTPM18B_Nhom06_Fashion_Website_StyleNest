package modules.service;

import modules.entity.Cart;

import java.util.List;

public interface CartService {
    List<Cart> findAll();

    Cart findById(String id);
}
