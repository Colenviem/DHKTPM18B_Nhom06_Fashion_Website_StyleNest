package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.entity.Account;
import modules.entity.Order;
import modules.entity.ShippingAddress;
import modules.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        Order order = orderService.findById(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        List<Order> orders = orderService.findByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.findByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> body) {
        try {
            Map<String, Object> addr = (Map<String, Object>) body.get("shippingAddress");

            ShippingAddress address = new ShippingAddress(
                    (String) addr.get("id"),
                    (String) addr.get("name"),
                    (String) addr.get("street"),
                    (String) addr.get("phoneNumber")
            );

            List<Map<String, Object>> itemsList = (List<Map<String, Object>>) body.get("items");
            Map<String, Integer> products = itemsList.stream()
                    .collect(Collectors.toMap(
                            item -> (String) item.get("productId"),
                            item -> (Integer) item.get("quantity")
                    ));

            String paymentMethod = (String) body.get("paymentMethod");

            Order order = orderService.createOrder(address, products, paymentMethod);

            return ResponseEntity.ok(order);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestBody Map<String, String> b) {
        Order order = orderService.updateStatus(id, b.get("status"));
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/products")
    public ResponseEntity<Order> addProduct(@PathVariable String id, @RequestBody Map<String, Object> b) {
        Order order = orderService.addProduct(
                id,
                (String) b.get("productId"),
                (Integer) b.get("quantity")
        );
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/monthly")
    public List<Map<String, Object>> getMonthlyRevenue(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return orderService.getMonthlyRevenue(year, month);
    }
    @GetMapping("/weekly-count")
    public ResponseEntity<Map<String, Object>> getWeeklyStats() {
        Map<String, Object> weeklyStats = orderService.getWeeklyStats();
        return ResponseEntity.ok(weeklyStats);
    }
    @GetMapping("/countPending/{status}")
    public int getCountOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.findByStatus(status);
        return orders.size();
    }
    @GetMapping("/filter")
    public ResponseEntity<List<Order>> getOrdersByMonthAndYear(
            @RequestParam int year,
            @RequestParam int month) {

        try {
            List<Order> orders = orderService.getOrdersByMonthAndYear(year, month);

            if (orders.isEmpty()) {
                return ResponseEntity.noContent().build(); // Trả về 204 nếu không có dữ liệu
            }
            return ResponseEntity.ok(orders); // Trả về danh sách Order

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Trả về 400 Bad Request
        }
    }
}
