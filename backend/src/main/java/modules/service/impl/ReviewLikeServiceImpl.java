package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.entity.ReviewLike;
import modules.repository.ReviewLikeRepository;
import modules.repository.ReviewRepository;
import modules.service.ReviewLikeService;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ReviewLikeServiceImpl implements ReviewLikeService {
    private final ReviewLikeRepository reviewLikeRepo;
    private final ReviewRepository reviewRepo;

    // LIKE
    public void likeReview(String reviewId, String userId) {

        if (reviewLikeRepo.existsByReviewIdAndUserId(reviewId, userId)) {
            throw new RuntimeException("Bạn đã like bài review này rồi!");
        }

        reviewLikeRepo.save(
                new ReviewLike(null, reviewId, userId, Instant.now())
        );

        reviewRepo.incrementLikes(reviewId);
    }

    // UNLIKE
    public void unlikeReview(String reviewId, String userId) {

        if (!reviewLikeRepo.existsByReviewIdAndUserId(reviewId, userId)) {
            throw new RuntimeException("Bạn chưa like bài này!");
        }

        reviewLikeRepo.deleteByReviewIdAndUserId(reviewId, userId);
        reviewRepo.decrementLikes(reviewId);
    }

    // CHECK USER ĐÃ LIKE CHƯA
    public boolean isLiked(String reviewId, String userId) {
        return reviewLikeRepo.existsByReviewIdAndUserId(reviewId, userId);
    }
}
