package modules.controller;

import modules.entity.Product;
import modules.service.impl.ProductServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

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
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable String categoryId) {
        return service.getProductsByCategoryId(categoryId);
    }
    @PostMapping("/updatePRO")
    public Product addProduct(@RequestBody Product product) {
        return service.updateProduct(product);
    }
}
