package modules.repository;

import modules.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory_Id(String categoryId);

  @Query("{'variants.size': ?0 }")
  List<Product> findProductsBySize(String size);

  // Tìm kiếm tương đối (name, brand, category, tags, material)
  @Query("{ '$or': [ " +
      "{ 'name': { $regex: ?0, $options: 'i' } }, " +
      "{ 'brand': { $regex: ?0, $options: 'i' } }, " +
      "{ 'category.id': { $regex: ?0, $options: 'i' } }, " +
      "{ 'tags': { $regex: ?0, $options: 'i' } }, " +
      "{ 'material': { $regex: ?0, $options: 'i' } } " +
      "] }")
  List<Product> searchProducts(String keyword);

}
