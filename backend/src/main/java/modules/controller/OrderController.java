package modules.controller;

import modules.entity.Order;
import modules.service.impl.OrderServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderServiceImpl service;

    public OrderController(OrderServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Order findById(@PathVariable String id) {
        return service.findById(id);
    }
}
