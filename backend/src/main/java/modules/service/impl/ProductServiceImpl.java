package modules.service.impl;

import modules.entity.Product;
import modules.entity.ProductVariant;
import modules.entity.Review;
import modules.repository.ProductRepository;
import modules.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements modules.service.ProductService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ProductServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> getProductsByCategoryId(String categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }
    @Override
    public Product updateProduct(Product product){
        return productRepository.save(product);
    }


    @Override
    public List<Product> findOutOfStockProducts() {
        List<Product> listProducts = productRepository.findAll();
        return listProducts.stream()
                .filter(p -> {
                    // het hang
                    if (!p.isAvailable()) {
                        return true;
                    }
                    // tat ca het hang
                    if (p.getVariants() != null && !p.getVariants().isEmpty()) {
                        return p.getVariants()
                                .stream()
                                .allMatch(v -> v.getInStock() == null || v.getInStock() <= 0);
                    }
                    return true;
                }).toList();
    }

    @Override
    public List<Product> findProductsBySize(String size) {
        return productRepository.findProductsBySize(size.trim().toUpperCase());
    }

    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.searchProducts(keyword.trim());
    }

    public Product incrementSoldAndDecrementStock(String productId, String sku, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Tăng sold của product
        product.setSold(product.getSold() + quantity);

        // Giảm inStock của variant tương ứng
        for (ProductVariant variant : product.getVariants()) {
            if (variant.getSku().equals(sku)) {
                int newStock = variant.getInStock() - quantity;
                if (newStock < 0) throw new RuntimeException("Stock không đủ!");
                variant.setInStock(newStock);
                break;
            }
        }

        return productRepository.save(product);
    }

    @Override
    public Product reCalculateAverageRating(String productId) {
        List<Review> reviews = reviewRepository.findByProduct_Id(productId);
        if(reviews.isEmpty()) {
            Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
            product.getRating().setAverage(0);
            product.getRating().setCount(0);
            return productRepository.save(product);
        }
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        product.getRating().setCount(reviews.size());
        product.getRating().setAverage(
                reviews.stream()
                        .mapToDouble(Review::getRating)
                        .average()
                        .orElse(0.0)
        );
        return productRepository.save(product);
    }
}
