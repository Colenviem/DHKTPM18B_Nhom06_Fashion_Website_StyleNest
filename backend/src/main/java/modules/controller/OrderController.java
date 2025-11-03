package modules.controller;

import modules.entity.Order;
import modules.entity.ShippingAddress;
import modules.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable String id) {
        return orderService.findById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable String userId) {
        return orderService.findByUserId(userId);
    }


    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable String status) {
        return orderService.findByStatus(status);
    }

    @PostMapping
    public Order createOrder(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");

        Map<String, Object> addressMap = (Map<String, Object>) payload.get("shippingAddress");
        ShippingAddress address = new ShippingAddress();
        address.setName((String) addressMap.get("name"));
        address.setStreet((String) addressMap.get("street"));
        address.setPhoneNumber((String) addressMap.get("phoneNumber"));

        List<Map<String,Object>> itemsList = (List<Map<String,Object>>) payload.get("items");
        Map<String, Integer> productQuantities = itemsList.stream()
                .collect(Collectors.toMap(
                        item -> (String)item.get("productId"),
                        item -> ((Number)item.get("quantity")).intValue()
                ));

        return orderService.createOrder(userId, address, productQuantities);
    }



    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return orderService.updateStatus(id, status);
    }

    @PostMapping("/{id}/products")
    public Order addProductToOrder(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String productId = (String) body.get("productId");
        int quantity = (int) body.get("quantity");
        return orderService.addProduct(id, productId, quantity);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
    }
}
