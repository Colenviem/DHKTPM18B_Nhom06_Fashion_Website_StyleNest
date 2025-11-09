package modules.repository;

import modules.entity.Account;
import modules.entity.Order;
import modules.entity.User;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByStatus(String status);

    @Aggregation(pipeline = {
            "{ $match: { $expr: { $and: [ " +
                    "{ $eq: [ { $year: '$createdAt' }, ?0 ] }, " +
                    "{ $eq: [ { $month: '$createdAt' }, ?1 ] } " +
                    "] } } }",
            "{ $project: { " +
                    "day: { $dayOfMonth: '$createdAt' }, " +
                    "totalAmount: 1 " +
                    "} }",
            "{ $group: { _id: '$day', total: { $sum: '$totalAmount' } } }",
            "{ $sort: { _id: 1 } }"
    })
    List<Map<String, Object>> getDailyRevenueByMonth(int year, int month);
    List<Order> findByCreatedAtBetween(Instant start, Instant end);
    @Aggregation(pipeline = {
            // Lọc các hóa đơn có createdAt thuộc năm và tháng đã cho
            "{ $match: { $expr: { $and: [ " +
                    "{ $eq: [ { $year: '$createdAt' }, ?0 ] }, " +
                    "{ $eq: [ { $month: '$createdAt' }, ?1 ] } " +
                    "] } } }",
            "{ $sort: { 'createdAt': 1 } }"
    })
    List<Order> findAllByMonthAndYear(int year, int month);
}
