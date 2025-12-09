package modules.service;

import modules.entity.Review;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.List;

@Service
public interface ReviewService {
    List<Review> findAll();

    Review findById(String id);

    List<Review> findByProductId(String productId);

    Review addReview(Review review);

    Review updateReview(Review review);

    Review findByUserIdAndProductId(String userId, String productId);
}
