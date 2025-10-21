package modules.service;

import modules.entity.Review;

import java.util.List;

public interface ReviewService {
    List<Review> findAll();

    Review findById(String id);
}
