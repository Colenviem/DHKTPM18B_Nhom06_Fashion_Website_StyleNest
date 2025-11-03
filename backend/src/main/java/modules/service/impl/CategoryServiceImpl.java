package modules.service.impl;

import modules.entity.Category;
import modules.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements modules.service.CategoryService {
    private final CategoryRepository repository;

    public CategoryServiceImpl(CategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Category> findAll() {
        return repository.findAll();
    }

    @Override
    public Category findById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Category addCategory(Category category) {
        return repository.save(category);
    }

    @Override
    public Category updateCategory(String id, Category updatedCategory) {
        return repository.findById(id).map(existingCategory -> {
            existingCategory.setName(updatedCategory.getName());
            existingCategory.setDescription(updatedCategory.getDescription());
            existingCategory.setImageUrl(updatedCategory.getImageUrl());
            return repository.save(existingCategory);
        }).orElseGet(() -> {
            updatedCategory.setId(id);
            return repository.save(updatedCategory);
        });
    }

    @Override
    public ResponseEntity<String> deleteCategory(String id) {
        return repository.findById(id).map(existingCategory -> {
            repository.delete(existingCategory);
            return ResponseEntity.ok("Category deleted successfully");
        }).orElseGet(() -> ResponseEntity.status(404).body("Category not found"));
    }
}
