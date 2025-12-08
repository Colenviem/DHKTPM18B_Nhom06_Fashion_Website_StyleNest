package modules.repository;

import modules.entity.ReviewLike;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewLikeRepository extends MongoRepository<ReviewLike, String> {

    boolean existsByReviewIdAndUserId(String reviewId, String userId);

    void deleteByReviewIdAndUserId(String reviewId, String userId);

    long countByReviewId(String reviewId);
}

