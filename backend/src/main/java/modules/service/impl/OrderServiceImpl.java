package modules.service.impl;

import modules.entity.*;
import modules.repository.OrderRepository;
import modules.repository.ProductRepository;
import modules.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderServiceImpl implements modules.service.OrderService {
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public OrderServiceImpl(OrderRepository orderRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    @Override
    public List<Order> findAll() {
        return orderRepo.findAll();
    }

    @Override
    public Order findById(String id) {
        return orderRepo.findById(id).orElse(null);
    }

    @Override
    public Order createOrder(String userId, ShippingAddress shippingAddress, Map<String, Integer> productQuantities) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        UserRef userRef = new UserRef(user.getId(), user.getFirstName() + " " + user.getLastName());
        order.setUser(userRef);
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setStatus("PENDING");
        order.setShippingAddress(shippingAddress);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        // KHÔNG cần khai báo subtotal = 0 ở đây nữa

        List<OrderItem> items = productQuantities.entrySet().stream().map(entry -> {
            String productId = entry.getKey();
            int quantity = entry.getValue();
            Product product = productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

            // Chuyển giá (có thể là double) sang long (ví dụ: đơn vị cents)
            // Đây là cách tốt nhất để xử lý tiền tệ trong Java.
            long unitPriceInLong = (long) Math.round(product.getPrice() * 100);

            OrderItem item = new OrderItem();
            ProductRef productRef = new ProductRef(
                    product.getId(),
                    product.getName(),
                    product.getImage(),
                    unitPriceInLong,
                    (int) product.getDiscount()
            );

            item.setProduct(productRef); // **QUAN TRỌNG: Phải gán ProductRef vào OrderItem**
            item.setQuantity(quantity);
            item.setUnitPrice(unitPriceInLong); // LƯU ý: Sửa lại giá trị unitPrice thành long đã chuyển đổi

            // BỎ HOÀN TOÀN DÒNG 'subtotal += ...' ra khỏi stream
            return item;
        }).toList();

        // TÍNH TỔNG (Reduction) SAU KHI CÓ LIST ITEMS
        // Đây là cách đúng và an toàn: tính tổng từ các OrderItem đã được tạo.
        double subtotal = items.stream()
                .mapToLong(item -> (item.getQuantity() * item.getUnitPrice())) // Lấy tổng tiền của từng mặt hàng
                .sum(); // Tính tổng toàn bộ

        order.setItems(items);
        order.setSubtotal(subtotal);
        order.setShippingFee(0);
        order.setTotalAmount(subtotal + order.getShippingFee());

        return orderRepo.save(order);
    }

    @Override
    public Order updateStatus(String orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        order.setUpdatedAt(Instant.now());
        return orderRepo.save(order);
    }

    @Override
    public Order addProduct(String orderId, String productId, int quantity) {
        Order order = findById(orderId);
        if(order == null) throw new RuntimeException("Order not found");

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        long unitPrice = (long) Math.round(product.getPrice() * 100);
        OrderItem item = new OrderItem();
        item.setProduct(new ProductRef(product.getId(), product.getName(), product.getImage(), unitPrice, (int) product.getDiscount()));
        item.setQuantity(quantity);
        item.setUnitPrice(unitPrice);

        order.getItems().add(item);

        // Cập nhật subtotal và tổng
        long newSubtotal = order.getItems().stream().mapToLong(i -> i.getQuantity() * i.getUnitPrice()).sum();
        order.setSubtotal(newSubtotal);
        order.setTotalAmount(newSubtotal + order.getShippingFee());
        order.setUpdatedAt(Instant.now());

        return orderRepo.save(order);
    }

    @Override
    public void deleteOrder(String orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepo.delete(order);
    }
    @Override
    public List<Order> findByUserId(String userId) {
        return orderRepo.findByUserId(userId);
    }

    @Override
    public List<Order> findByStatus(String status) {
        return orderRepo.findByStatus(status);
    }
}
