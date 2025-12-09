package modules.service.impl;

import modules.entity.Product;
import modules.entity.ProductVariant;
import modules.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements modules.service.ProductService {
    private final ProductRepository repository;
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
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
    @Override
    public Product updateProduct(Product product){
        return repository.save(product);
    }


    @Override
    public List<Product> findOutOfStockProducts() {
        List<Product> listProducts = repository.findAll();
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
            return repository.findAll();
        }
        return repository.searchProducts(keyword.trim());
    }

    public Product incrementSoldAndDecrementStock(String productId, String sku, int quantity) {
        Product product = repository.findById(productId)
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

        return repository.save(product);
    }
}
