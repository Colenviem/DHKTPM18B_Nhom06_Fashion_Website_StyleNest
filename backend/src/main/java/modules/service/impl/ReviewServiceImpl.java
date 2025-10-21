package modules.service.impl;

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
}
