package modules.controller;

import jakarta.validation.Valid;
import modules.entity.Product;
import modules.entity.Rating;
import modules.service.impl.ProductServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductServiceImpl service;

    public ProductController(ProductServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Product findById(@PathVariable String id) {
        return service.findById(id);
    }
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable String categoryId) {
        return service.getProductsByCategoryId(categoryId);
    }
    @PostMapping("/updatePRO")
    public ResponseEntity<?> addOrUpdateProduct(
            @Valid @RequestBody Product product,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );

            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Dữ liệu không hợp lệ",
                    "errors", errors
            ));
        }

        // 🧩 Nếu là sản phẩm mới → tự sinh ID
        if (product.getId() == null || product.getId().isEmpty()) {
            long count = service.findAll().size();
            String newId = String.format("PRO%03d", count + 1);
            product.setId(newId);
            product.setAvailable(true);
            product.setCreatedAt(Instant.now());
            product.setRating(new Rating(0.0,0));
        }
        product.setUpdatedAt(Instant.now());

        Product saved = service.updateProduct(product);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Lưu sản phẩm thành công",
                "data", saved
        ));
    }

    @GetMapping("/outofstock")
    public ResponseEntity<List<Product>> findOutOfStockProducts() {
        List<Product> outOfStockProducts = service.findOutOfStockProducts();
        return ResponseEntity.ok(outOfStockProducts);
    }

    @GetMapping("/by-size/{size}")
    public ResponseEntity<List<Product>> findProductsBySize(@PathVariable String size) {
        List<Product> products = service.findProductsBySize(size);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    // TÌM KIẾM
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> results = service.searchProducts(keyword);
        return ResponseEntity.ok(results);
    }
}
