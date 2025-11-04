package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.entity.Category;
import modules.repository.CategoryRepository;
import modules.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;

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
        // Nếu muốn tạo ID theo name, đặt ở đây (not in controller)
        if (category.getId() == null) {
            category.setId(category.getName());
        }
        return repository.save(category);
    }

    @Override
    public Category updateCategory(String id, Category updatedCategory) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(updatedCategory.getName());
                    existing.setDescription(updatedCategory.getDescription());
                    existing.setImageUrl(updatedCategory.getImageUrl());
                    return repository.save(existing);
                })
                .orElseGet(() -> {
                    updatedCategory.setId(id);
                    return repository.save(updatedCategory);
                });
    }

    @Override
    public boolean deleteCategory(String id) {
        return repository.findById(id)
                .map(existing -> {
                    repository.delete(existing);
                    return true;
                })
                .orElse(false);
    }
}