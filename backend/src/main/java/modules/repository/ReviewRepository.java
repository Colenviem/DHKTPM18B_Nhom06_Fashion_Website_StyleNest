package modules.repository;

import modules.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String>, ReviewCustomRepository {

    List<Review> findByProduct_Id(String productId);
}
