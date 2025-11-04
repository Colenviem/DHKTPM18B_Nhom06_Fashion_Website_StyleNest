package modules.service.impl;

import modules.entity.Cart;
import modules.entity.ProductRef;
import modules.repository.CartRepository;
import modules.service.CartService;
import org.springframework.stereotype.Service;

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
        if (existing == null) return null;

        if (incomingCart.getItems() != null) {
            existing.getItems().clear();

            incomingCart.getItems().forEach(item -> {
                if (item.getProduct() != null && item.getProduct().getId() != null) {

                    ProductRef ref = new ProductRef();
                    ref.setId(item.getProduct().getId());
                    ref.setName(item.getProduct().getName());
                    ref.setImage(item.getProduct().getImage());
                    ref.setPrice(item.getProduct().getPrice());
                    ref.setDiscount(item.getProduct().getDiscount());

                    item.setProduct(ref);
                }
                existing.getItems().add(item);
            });
        }

        existing.setTotalQuantity(incomingCart.getTotalQuantity());
        existing.setTotalPrice(incomingCart.getTotalPrice());

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
}
