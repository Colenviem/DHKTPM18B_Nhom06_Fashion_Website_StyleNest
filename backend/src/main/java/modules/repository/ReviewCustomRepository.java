package modules.repository;

public interface ReviewCustomRepository {
    void incrementLikes(String reviewId);
    void decrementLikes(String reviewId);
}
