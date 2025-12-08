package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.service.ReviewLikeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "${FRONTEND_URL}")
@RequiredArgsConstructor
public class ReviewLikeController {

    private final ReviewLikeService reviewLikeService;

    // LIKE
    @PostMapping("/{reviewId}/like")
    public String likeReview(
            @PathVariable String reviewId,
            @RequestParam String userId
    ) {
        reviewLikeService.likeReview(reviewId, userId);
        return "Like thành công";
    }

    // UNLIKE
    @DeleteMapping("/{reviewId}/like")
    public String unlikeReview(
            @PathVariable String reviewId,
            @RequestParam String userId
    ) {
        reviewLikeService.unlikeReview(reviewId, userId);
        return "Unlike thành công";
    }

    // CHECK ĐÃ LIKE CHƯA
    @GetMapping("/{reviewId}/liked")
    public boolean isLiked(
            @PathVariable String reviewId,
            @RequestParam String userId
    ) {
        return reviewLikeService.isLiked(reviewId, userId);
    }
}

