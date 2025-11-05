package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.entity.Order;
import modules.entity.ShippingAddress;
import modules.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

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
    public Order createOrder(@RequestBody Map<String, Object> body) {

        String userId = (String) body.get("userId");

        Map<String, Object> addr = (Map<String, Object>) body.get("shippingAddress");
        ShippingAddress address = new ShippingAddress(
                (String) addr.get("id"),
                (String) addr.get("name"),
                (String) addr.get("street"),
                (String) addr.get("phoneNumber")
        );

        Map<String, Integer> products = (Map<String, Integer>) body.get("products");

        return orderService.createOrder(userId, address, products);
    }


    /** ========== UPDATE STATUS ========== */
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable String id, @RequestBody Map<String, String> b) {
        return orderService.updateStatus(id, b.get("status"));
    }


    /** ========== ADD PRODUCT ========== */
    @PostMapping("/{id}/products")
    public Order addProduct(@PathVariable String id, @RequestBody Map<String, Object> b) {
        return orderService.addProduct(id, (String) b.get("productId"), (Integer) b.get("quantity"));
    }


    /** ========== DELETE ORDER ========== */
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
    }
}