package modules.repository;

import modules.entity.LoginHistory;
import modules.entity.Role;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LoginHistoryRepository extends MongoRepository<LoginHistory, String> {

    // Lấy lịch sử login trong khoảng thời gian
    List<LoginHistory> findByTimeLoginBetween(LocalDateTime start, LocalDateTime end);

    // Aggregation: đếm số người dùng truy cập, nhóm theo username
    @Aggregation(pipeline = {
            "{ $match: { timeLogin: { $gte: ?0, $lte: ?1 } } }",
            "{ $group: { _id: '$username', count: { $sum: 1 } } }"
    })
    List<Object> countLoginByUsername(LocalDateTime start, LocalDateTime end);
}
