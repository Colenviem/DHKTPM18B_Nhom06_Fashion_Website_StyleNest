package modules.repository;

import modules.dto.request.ProductRevenueDTO;
import modules.entity.Account;
import modules.entity.Order;
import modules.entity.Product;
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


    @Aggregation(pipeline = {
            "{ '$match': { " +
                    "    '$or': [ " +
                    "      { 'status': 'Completed' }, " +
                    "      { 'status': 'Delivered' }, " +
                    "      { 'status': 'Paid' } " +
                    "    ], " +
                    "    'createdAt': { '$gte': ?0, '$lt': ?1 } " +
                    "} }",

            "{ '$unwind': '$items' }",
            "{ '$project': { " +
                    "    'name': '$items.product.name', " +
                    "    'revenue': { " +
                    "      '$multiply': [ " +
                    "        '$items.quantity', " +
                    "        '$items.unitPrice', " +
                    "        { '$divide': [ { '$subtract': [100, '$items.product.discount'] }, 100 ] } " +
                    "      ] " +
                    "    } " +
                    "} }",

            "{ '$group': { " +
                    "    '_id': '$name', " +
                    "    'revenue': { '$sum': '$revenue' } " +
                    "} }",

            "{ '$sort': { 'revenue': -1 } }",

            "{ '$setWindowFields': { " +
                    "    'sortBy': { 'revenue': -1 }, " +
                    "    'output': { 'rank': { '$rank': {} } } " +
                    "} }",

            "{ '$facet': { " +
                    "    'top5': [ " +
//                    "      { '$match': { 'rank': { '$lte': 5 } } }, " +
                    "      { '$project': { '_id': 0, 'name': '$_id', 'revenue': 1 } } " +
                    "    ], " +
                    "    'others': [ " +
                    "      { '$match': { 'rank': { '$gt': 5 } } }, " +
                    "      { '$group': { '_id': null, 'revenue': { '$sum': '$revenue' } } } " +
                    "    ] " +
                    "} }",

            "{ '$project': { " +
                    "    'result': { " +
                    "      '$concatArrays': [ " +
                    "        '$top5', " +
                    "        { '$cond': [ " +
                    "          { '$gt': [{ '$size': '$others' }, 0] }, " +
                    "          [{ 'name': 'Các sản phẩm khác', 'revenue': { '$arrayElemAt': ['$others.revenue', 0] } }], " +
                    "          [] " +
                    "        ]} " +
                    "      ] } " +
                    "} }",

            "{ '$unwind': '$result' }",
            "{ '$replaceRoot': { 'newRoot': '$result' } }"
    })
    List<ProductRevenueDTO> findTop5ProductsRevenueInMonth(Instant start, Instant end);


}
