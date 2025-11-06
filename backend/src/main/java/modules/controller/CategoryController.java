package modules.controller;

import modules.entity.Category;
import modules.service.impl.CategoryServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryServiceImpl service;

    public CategoryController(CategoryServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Category findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Category save(@RequestBody Category category) {
        int count = service.findAll().size();
        String newId = String.format("CAT%03d", count + 1);
        category.setId(newId);
        return service.saveCategory(category);
    }

}
