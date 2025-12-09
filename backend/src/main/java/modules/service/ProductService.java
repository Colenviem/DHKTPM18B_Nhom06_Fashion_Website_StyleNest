package modules.service;

import modules.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    List<Product> findAll();

    Product findById(String id);

    List<Product> getProductsByCategoryId(String categoryId);

    Product updateProduct(Product product);
    List<Product> findOutOfStockProducts();

    List<Product> findProductsBySize(String size);

    List<Product> searchProducts(String keyword);

    Product reCalculateAverageRating(String productId);
}
