package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.entity.*;
import modules.repository.OrderRepository;
import modules.repository.ProductRepository;
import modules.repository.UserRepository;
import modules.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
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

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new RuntimeException("No authentication found");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof modules.entity.Account) {
            modules.entity.Account account = (modules.entity.Account) principal;
            String userId = account.getUserId();
            System.out.println("👤 User ID: " + userId);

            if (userId == null) {
                throw new RuntimeException("User ID is null in Account");
            }

            return userId;
        }

        else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            org.springframework.security.core.userdetails.UserDetails userDetails =
                    (org.springframework.security.core.userdetails.UserDetails) principal;
            String username = userDetails.getUsername();
            System.out.println("👤 Username: " + username);

            User user = userRepo.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + username));
            return user.getId();
        }
        else if (principal instanceof String) {
            String username = (String) principal;
            System.out.println("👤 Username (String): " + username);

            User user = userRepo.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + username));
            return user.getId();
        }

        throw new RuntimeException("Cannot extract user ID from principal: " + principal.getClass().getName());
    }
    @Override
    public Order createOrder(ShippingAddress address, Map<String, Integer> products) {
        try {
            String userId = getCurrentUserId();

            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            List<OrderItem> items = new ArrayList<>();
            for (Map.Entry<String, Integer> e : products.entrySet()) {
                OrderItem item = createOrderItem(e.getKey(), e.getValue());
                items.add(item);
            }

            double subtotal = calcSubtotal(items);

            ShippingAddress cleanAddress = new ShippingAddress();
            cleanAddress.setName(address.getName());
            cleanAddress.setStreet(address.getStreet());
            cleanAddress.setPhoneNumber(address.getPhoneNumber());

            UserRef userRef = new UserRef();
            userRef.setId(user.getId());
            userRef.setUserName(user.getFirstName() + " " + user.getLastName());

            Order order = new Order();
            order.setUser(userRef);
            order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8));
            order.setStatus("PENDING");
            order.setShippingAddress(cleanAddress);
            order.setItems(items);
            order.setSubtotal(subtotal);
            order.setShippingFee(30000);
            order.setDiscountAmount(0);
            order.setTotalAmount(subtotal + order.getShippingFee() - order.getDiscountAmount());
            order.setCreatedAt(Instant.now());
            order.setUpdatedAt(Instant.now());

            Order savedOrder = orderRepo.save(order);
            return savedOrder;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    private OrderItem createOrderItem(String productId, int quantity) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        long unitPrice = Math.round(product.getPrice() * 100);

        if (product.getVariants() == null || product.getVariants().isEmpty()) {
            throw new RuntimeException("Product has no variants: " + productId);
        }

        if (product.getVariants().get(0).getImages() == null ||
                product.getVariants().get(0).getImages().isEmpty()) {
            throw new RuntimeException("Product variant has no images: " + productId);
        }

        ProductRef ref = new ProductRef();
        ref.setId(product.getId());
        ref.setName(product.getName());
        ref.setImage(product.getVariants().get(0).getImages().get(0));
        ref.setPrice(unitPrice);
        ref.setDiscount((int) product.getDiscount());

        return new OrderItem(ref, null, quantity, unitPrice);
    }
    private double calcSubtotal(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(i -> i.getQuantity() * i.getUnitPrice())
                .sum();
    }



    @Override
    public Order updateStatus(String id, String status) {
        Order order = findById(id);
        order.setStatus(status);
        order.setUpdatedAt(Instant.now());
        return orderRepo.save(order);
    }


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


    @Override
    public void deleteOrder(String id) {
        Order order = findById(id);
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