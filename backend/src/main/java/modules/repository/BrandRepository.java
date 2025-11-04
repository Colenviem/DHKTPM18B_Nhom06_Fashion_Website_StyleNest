package modules.repository;

import modules.entity.Brand;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BrandRepository extends MongoRepository<Brand, String> {
    List<Brand> findByNameContainingIgnoreCase(String name);
}
