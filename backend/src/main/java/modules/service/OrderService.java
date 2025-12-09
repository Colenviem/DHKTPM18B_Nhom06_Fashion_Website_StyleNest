package modules.service;

import modules.dto.request.ProductRevenueDTO;
import modules.dto.request.WeeklyStatResultRepuest;
import modules.entity.Order;
import modules.entity.ShippingAddress;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public interface OrderService {

    List<Order> findAll();

    Order findById(String id);

    Order updateStatus(String orderId, String status);

    @Transactional
    Order createOrder(ShippingAddress address, List<Map<String, Object>> itemsList,
                      String paymentMethod, String couponCode);

    Order addProduct(String orderId, String productId, int quantity);

    void deleteOrder(String orderId);

    List<Order> findByUserId(String userId);

    List<Order> findByStatus(String status);

    List<Map<String, Object>> getMonthlyRevenue(int year, int month);


    Map<String, Instant> getWeekRange(int offset);

    WeeklyStatResultRepuest getWeeklyStatsInRange(Instant start, Instant end);

    Map<String, Object> getWeeklyStats();

    List<Order> getOrdersByMonthAndYear(int year, int month);

    List<ProductRevenueDTO> getTop5ProductsRevenue(int year, int month);

}