package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.entity.*;
import modules.repository.OrderRepository;
import modules.repository.ProductRepository;
import modules.repository.UserRepository;
import modules.service.OrderService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;


    @Override
    public List<Order> findAll() {
        return orderRepo.findAll();
    }

    @Override
    public Order findById(String id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }


    /* ================== CREATE ================== */
    @Override
    public Order createOrder(String userId, ShippingAddress address, Map<String, Integer> products) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderItem> items = products.entrySet()
                .stream()
                .map(e -> createOrderItem(e.getKey(), e.getValue()))
                .toList();

        double subtotal = calcSubtotal(items);

        Order order = new Order();
        order.setUser(new UserRef(
                user.getId(),
                user.getFirstName() + " " + user.getLastName()
        ));
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setStatus("PENDING");
        order.setShippingAddress(address);
        order.setItems(items);
        order.setSubtotal(subtotal);
        order.setShippingFee(0);
        order.setTotalAmount(subtotal);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        return orderRepo.save(order);
    }


    /* ========== UPDATE STATUS ========== */
    @Override
    public Order updateStatus(String id, String status) {
        Order order = findById(id);
        order.setStatus(status);
        order.setUpdatedAt(Instant.now());
        return orderRepo.save(order);
    }


    /* ========== ADD PRODUCT ========== */
    @Override
    public Order addProduct(String orderId, String productId, int quantity) {

        Order order = findById(orderId);
        order.getItems().add(createOrderItem(productId, quantity));

        double subtotal = calcSubtotal(order.getItems());
        order.setSubtotal(subtotal);
        order.setTotalAmount(subtotal + order.getShippingFee());
        order.setUpdatedAt(Instant.now());

        return orderRepo.save(order);
    }


    /* ========== DELETE ========== */
    @Override
    public void deleteOrder(String id) {
        Order order = findById(id);
        orderRepo.delete(order);
    }


    /* ========== QUERY ========== */
    @Override
    public List<Order> findByUserId(String userId) {
        return orderRepo.findByUserId(userId);
    }

    @Override
    public List<Order> findByStatus(String status) {
        return orderRepo.findByStatus(status);
    }


    /* ================= PRIVATE HELPERS ================= */

    private OrderItem createOrderItem(String productId, int quantity) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        long unitPrice = Math.round(product.getPrice() * 100);

        ProductRef ref = new ProductRef(
                product.getId(),
                product.getName(),
                product.getImage(),
                unitPrice,
                (int) product.getDiscount()
        );

        return new OrderItem(ref, null, quantity, unitPrice);
    }


    private double calcSubtotal(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(i -> i.getQuantity() * i.getUnitPrice())
                .sum();
    }
}