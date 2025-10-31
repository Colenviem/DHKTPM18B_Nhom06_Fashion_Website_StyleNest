package modules.service.impl;

import modules.entity.Product;
import modules.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements modules.service.ProductService {
    private final ProductRepository repository;

    public ProductServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Product> findAll() {
        return repository.findAll();
    }

    @Override
    public Product findById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Product> getProductsByCategoryId(String categoryId) {
        return repository.findByCategory_Id(categoryId);
    }

}
