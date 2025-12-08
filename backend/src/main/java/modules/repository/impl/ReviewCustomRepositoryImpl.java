package modules.repository.impl;

import lombok.RequiredArgsConstructor;
import modules.repository.ReviewCustomRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ReviewCustomRepositoryImpl implements ReviewCustomRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public void incrementLikes(String reviewId) {
        Query query = new Query(Criteria.where("_id").is(reviewId));
        Update update = new Update().inc("likes", 1);
        mongoTemplate.updateFirst(query, update, "Reviews");
    }

    @Override
    public void decrementLikes(String reviewId) {
        Query query = new Query(Criteria.where("_id").is(reviewId));
        Update update = new Update().inc("likes", -1);
        mongoTemplate.updateFirst(query, update, "Reviews");
    }
}
