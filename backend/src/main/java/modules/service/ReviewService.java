package modules.service;

import modules.entity.Review;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReviewService {
    List<Review> findAll();

    Review findById(String id);

}
