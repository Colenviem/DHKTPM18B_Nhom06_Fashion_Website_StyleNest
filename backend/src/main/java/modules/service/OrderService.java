package modules.service;

import modules.entity.Order;

import java.util.List;

public interface OrderService {
    List<Order> findAll();

    Order findById(String id);
}
