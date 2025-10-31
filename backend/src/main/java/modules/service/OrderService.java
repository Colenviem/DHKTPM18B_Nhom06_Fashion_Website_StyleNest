package modules.service;

import modules.entity.Order;
import modules.entity.ShippingAddress;
import modules.entity.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface OrderService {
    List<Order> findAll();

    Order findById(String id);

    Order createOrder(String userId, ShippingAddress shippingAddress, Map<String, Integer> productQuantities);

    Order updateStatus(String orderId, String status);

    Order addProduct(String orderId, String productId, int quantity);

    void deleteOrder(String orderId);

    List<Order> findByUserId(String userId);

    List<Order> findByStatus(String status);
}
