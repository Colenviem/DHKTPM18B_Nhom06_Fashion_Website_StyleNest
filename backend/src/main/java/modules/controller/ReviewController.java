package modules.controller;

import modules.entity.Review;
import modules.service.impl.ReviewServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "${FRONTEND_URL}")
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
    public ResponseEntity<?> create(@RequestBody Review review) {
        if(service.findByUserIdAndProductId(
                review.getUser().getId(),
                review.getProduct().getId()) != null) {
            throw new RuntimeException("Bạn đã review sản phẩm này rồi.");
        }
        try {
            Review created = service.addReview(review);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    )
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestBody Review review
    ) {
        if (!id.equals(review.getId())) {
            return ResponseEntity.badRequest().body(Map.of("status","error","message","ID không khớp"));
        }
        Review existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("Updating review: " + review);
        Review updated = service.updateReview(review);
        return ResponseEntity.ok(updated);
    }
}
