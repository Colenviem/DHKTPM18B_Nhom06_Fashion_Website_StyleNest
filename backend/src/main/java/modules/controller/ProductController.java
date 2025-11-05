package modules.controller;

import modules.entity.Product;
import modules.service.impl.ProductServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
