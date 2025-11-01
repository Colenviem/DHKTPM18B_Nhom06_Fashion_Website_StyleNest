package modules.controller;

import modules.entity.Order;
import modules.entity.ShippingAddress;
import modules.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 🟢 Lấy tất cả đơn hàng
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }

    // 🟢 Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable String id) {
        return orderService.findById(id);
    }

    // 🟢 Lấy danh sách đơn theo userId
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable String userId) {
        return orderService.findByUserId(userId);
    }

    // 🟢 Lọc theo trạng thái
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable String status) {
        return orderService.findByStatus(status);
    }

    // 🟢 Tạo đơn hàng mới
    // 🟢 Tạo đơn hàng mới
    @PostMapping
    public Order createOrder(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");

        Map<String, Object> addressMap = (Map<String, Object>) payload.get("shippingAddress");
        ShippingAddress address = new ShippingAddress();
        address.setName((String) addressMap.get("fullName"));
        address.setStreet((String) addressMap.get("addressDetail"));
        address.setPhoneNumber((String) addressMap.get("phone"));

        Map<String, Integer> productQuantities = (Map<String, Integer>) payload.get("productQuantities");

        return orderService.createOrder(userId, address, productQuantities);
    }


    // 🟠 Cập nhật trạng thái đơn
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return orderService.updateStatus(id, status);
    }

    // 🟠 Thêm sản phẩm vào đơn
    @PostMapping("/{id}/products")
    public Order addProductToOrder(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String productId = (String) body.get("productId");
        int quantity = (int) body.get("quantity");
        return orderService.addProduct(id, productId, quantity);
    }

    // 🔴 Xóa đơn hàng
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
    }
}
