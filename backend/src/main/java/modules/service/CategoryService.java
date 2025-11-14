package modules.service;

import modules.entity.Category;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    List<Category> findAll();

    Category findById(String id);

    Category addCategory(Category category);

    Category updateCategory(String id, Category updatedCategory);

    boolean deleteCategory(String id);
}
