package modules.service;

import modules.entity.Order;
import modules.entity.ShippingAddress;

import java.util.List;
import java.util.Map;

public interface OrderService {

    List<Order> findAll();

    Order findById(String id);

    Order createOrder(String userId, ShippingAddress address, Map<String, Integer> products);

    Order updateStatus(String orderId, String status);

    Order addProduct(String orderId, String productId, int quantity);

    void deleteOrder(String orderId);

    List<Order> findByUserId(String userId);

    List<Order> findByStatus(String status);
}