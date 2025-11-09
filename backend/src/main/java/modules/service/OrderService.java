package modules.service;

import modules.dto.request.WeeklyStatResultRepuest;
import modules.entity.Order;
import modules.entity.ShippingAddress;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public interface OrderService {

    List<Order> findAll();

    Order findById(String id);

    Order createOrder(ShippingAddress address, Map<String, Integer> products);

    Order updateStatus(String orderId, String status);

    Order addProduct(String orderId, String productId, int quantity);

    void deleteOrder(String orderId);

    List<Order> findByUserId(String userId);

    List<Order> findByStatus(String status);

    List<Map<String, Object>> getMonthlyRevenue(int year, int month);


    Map<String, Instant> getWeekRange(int offset);

    WeeklyStatResultRepuest getWeeklyStatsInRange(Instant start, Instant end);

    Map<String, Object> getWeeklyStats();

    List<Order> getOrdersByMonthAndYear(int year, int month);
}