package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.entity.Review;
import modules.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements modules.service.ReviewService {
    private final ReviewRepository repository;

    public ReviewServiceImpl(ReviewRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Review> findAll() {
        return repository.findAll();
    }

    @Override
    public Review findById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Review> findByProductId(String productId) {
        return repository.findByProduct_Id(productId);
    }

    @Override
    public Review addReview(Review review) {
        return repository.save(review);
    }

    @Override
    public Review updateReview(Review review) {
        return repository.findById(review.getId())
                .map(existing -> {
                    existing.setRating(review.getRating());
                    existing.setComment(review.getComment());
                    existing.setImages(review.getImages());
                    existing.setApproved(review.isApproved());
                    return repository.save(existing);
                }).orElse(null);
    }

    @Override
    public Review findByUserIdAndProductId(String userId, String productId) {
        return repository.findByUser_IdAndProduct_Id(userId, productId);
    }
}
