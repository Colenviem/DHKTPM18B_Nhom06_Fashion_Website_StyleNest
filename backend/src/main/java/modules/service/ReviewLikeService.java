package modules.service;

public interface ReviewLikeService {

    public void likeReview(String reviewId, String userId);

    public void unlikeReview(String reviewId, String userId);
    
    public boolean isLiked(String reviewId, String userId);

}
