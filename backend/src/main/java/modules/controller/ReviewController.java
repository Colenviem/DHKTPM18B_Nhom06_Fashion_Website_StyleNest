package modules.controller;

import modules.entity.Review;
import modules.service.impl.ReviewServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewServiceImpl service;

    public ReviewController(ReviewServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public List<Review> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Review findById(@PathVariable String id) {
        return service.findById(id);
    }

    @GetMapping("/product/{productId}")
    public List<Review> findByProduct(@PathVariable String productId) {
        return service.findByProductId(productId);
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        return service.addReview(review);
    }

}
