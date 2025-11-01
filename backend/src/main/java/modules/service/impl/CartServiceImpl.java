package modules.service.impl;

import modules.entity.Cart;
import modules.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements modules.service.CartService {
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
}
