package modules.repository;

import modules.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    @Query("{'variants.size': ?0 }")
    List<Product> findProductsBySize(String size);
}
