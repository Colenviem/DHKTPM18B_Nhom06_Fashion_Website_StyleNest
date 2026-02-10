package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.dto.request.ProductRevenueDTO;
import modules.entity.Coupon;
import modules.entity.Order;
import modules.entity.ShippingAddress;
import modules.repository.CouponRepository;
import modules.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "${FRONTEND_URL}")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CouponRepository couponRepository;

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
            List<Map<String, Object>> products = itemsList.stream()
                    .map(item -> {
                        Object productId = item.get("product") != null ? ((Map<String, Object>)item.get("product")).get("id") : null;
                        if (productId == null) {
                            productId = UUID.randomUUID().toString(); // hoặc throw lỗi rõ ràng
                        }
                        Object variantId = item.get("variantId");
                        int quantity = ((Number) item.get("quantity")).intValue();

                        Map<String, Object> map = new HashMap<>();
                        map.put("productId", productId);
                        map.put("variantId", variantId);
                        map.put("quantity", quantity);
                        return map;
                    }).collect(Collectors.toList());


            String paymentMethod = (String) body.get("paymentMethod");
            String couponCode = (String) body.get("couponCode");

            Order order = orderService.createOrder(address, products, paymentMethod, couponCode);

            return ResponseEntity.ok(order);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestParam String code,
            @RequestParam double orderAmount
    ) {
        Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCase(code.trim());

        if (couponOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "message", "Mã giảm giá không tồn tại"
            ));
        }

        Coupon coupon = couponOpt.get();

        if (!coupon.isActive()) {
            return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "message", "Mã giảm giá đã bị khóa hoặc không kích hoạt"
            ));
        }

        if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "message", "Mã giảm giá đã hết lượt sử dụng"
            ));
        }

        if (coupon.getExpirationDate().isBefore(Instant.now())) {
            return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "message", "Mã giảm giá đã hết hạn"
            ));
        }

        if (orderAmount < coupon.getMinimumOrderAmount()) {
            return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "message", "Không đủ điều kiện sử dụng mã này"
            ));
        }

        double discountValue;
        if ("ORDER".equalsIgnoreCase(coupon.getType())) {
            discountValue = (coupon.getDiscount() < 100)
                    ? orderAmount * (coupon.getDiscount() / 100.0)
                    : coupon.getDiscount();
        } else {
            discountValue = coupon.getDiscount();
        }

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "code", coupon.getCode(),
                "type", coupon.getType(),
                "discount", discountValue,
                "message", "Áp dụng mã thành công!"
        ));
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
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(orders);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/reports/top-products")
    public ResponseEntity<List<ProductRevenueDTO>> getTop5Products(
            @RequestParam int year,
            @RequestParam int month) {
        List<ProductRevenueDTO> result =orderService.getTop5ProductsRevenue(year, month);
        return ResponseEntity.ok(result);
    }

}
