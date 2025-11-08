package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.entity.Category;
import modules.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable String id) {
        Category category = service.findById(id);
        return category != null
                ? ResponseEntity.ok(category)
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(
            @PathVariable String id,
            @RequestBody Category updatedCategory
    ) {
        Category category = service.updateCategory(id, updatedCategory);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = service.deleteCategory(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Category save(@RequestBody Category category) {
        int count = service.findAll().size();
        String newId = String.format("CAT%03d", count + 1);
        category.setId(newId);
        return service.addCategory(category);
    }

}
