package modules.service;

import modules.entity.Cart;
import modules.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartRepository repository;

    public CartService(CartRepository repository) {
        this.repository = repository;
    }

    public List<Cart> findAll() {
        return repository.findAll();
    }

    public Cart findById(String id) {
        return repository.findById(id).orElse(null);
    }
}
