package modules.service;

import modules.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();

    Category findById(String id);

    Category addCategory(Category category);

    Category updateCategory(String id, Category updatedCategory);

    boolean deleteCategory(String id);
}