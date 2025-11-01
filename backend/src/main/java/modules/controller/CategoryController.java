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
    public Category addCategory(@RequestBody Category category) {
        if (category.getId() == null) {
            category.setId(category.getName());
        }
        return service.addCategory(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category updatedCategory) {
        return service.updateCategory(id, updatedCategory);
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable String id) {
        return service.deleteCategory(id).getBody();
    }
}
