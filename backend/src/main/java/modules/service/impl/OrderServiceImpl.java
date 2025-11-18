package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.dto.request.WeeklyStatResultRepuest;
import modules.entity.*;
import modules.repository.OrderRepository;
import modules.repository.ProductRepository;
import modules.repository.UserRepository;
import modules.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private static final String EXCLUDED_STATUS = "PENDING";

    private final ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh");

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
    @Transactional
    public Order createOrder(ShippingAddress address, Map<String, Integer> products) {
        try {
            String userId = getCurrentUserId();

            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            checkStock(products);

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



            reduceStock(products);
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

        long unitPrice = Math.round(product.getPrice());

        if (product.getVariants() == null || product.getVariants().isEmpty()) {
            throw new RuntimeException("Product has no variants: " + productId);
        }

        // Lấy variant đầu tiên (hoặc variant được chọn từ FE)
        ProductVariant selectedVariant = product.getVariants().get(0);

        if (selectedVariant.getImages() == null || selectedVariant.getImages().isEmpty()) {
            throw new RuntimeException("Product variant has no images: " + productId);
        }

        ProductRef ref = new ProductRef();
        ref.setId(product.getId());
        ref.setName(product.getName());
        ref.setImage(selectedVariant.getImages().get(0));
        ref.setPrice(unitPrice);
        ref.setDiscount((int) product.getDiscount());

        // LƯU VARIANT ID VÀO ORDER ITEM - QUAN TRỌNG!
        return new OrderItem(ref, selectedVariant.getSku(), quantity, unitPrice);
    }

    private long calcSubtotal(List<OrderItem> items) {
        return items.stream()
                .mapToLong(i -> i.getQuantity() * i.getUnitPrice())
                .sum();
    }



//    @Override
//    public Order updateStatus(String id, String status) {
//        Order order = findById(id);
//        order.setStatus(status);
//        order.setUpdatedAt(Instant.now());
//        return orderRepo.save(order);
//    }


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

    @Override
    public List<Map<String, Object>> getMonthlyRevenue(int year, int month) {
        List<Map<String, Object>> dailyData = orderRepo.getDailyRevenueByMonth(year, month);

        YearMonth yearMonth = YearMonth.of(year, month);
        int daysInMonth = yearMonth.lengthOfMonth();

        List<Map<String, Object>> result = new ArrayList<>();

        // Vòng lặp này chỉ chạy 6 lần, đại diện cho 6 cột dữ liệu (5 ngày/cột)
        for (int i = 0; i < 6; i++) {

            int startDay;
            int endDay;

            if (i < 5) { // 5 cột đầu tiên (từ 1-5 đến 21-25)
                startDay = i * 5 + 1;
                endDay = startDay + 4; // Luôn là 5 ngày
            } else { // Cột cuối cùng (thứ 6: từ 26 đến hết tháng)
                startDay = 26;
                // Đảm bảo cột cuối cùng luôn kéo dài đến hết tháng, kể cả ngày 31
                endDay = daysInMonth;
            }

            // --- Logic Tính Tổng Doanh thu cho Phạm vi (Range) ---
            long total = 0;

            // Lặp qua dữ liệu dailyData đã lấy từ DB (giả định đây là danh sách ngắn)
            for (Map<String, Object> dayData : dailyData) {
                // Đảm bảo rằng _id là kiểu Number trước khi cast
                Number dayNumber = (Number) dayData.get("_id");
                if (dayNumber == null) continue;

                int day = dayNumber.intValue();

                if (day >= startDay && day <= endDay) {
                    // Đảm bảo rằng "total" là kiểu Number trước khi cast
                    Number totalNumber = (Number) dayData.get("total");
                    if (totalNumber != null) {
                        total += totalNumber.longValue();
                    }
                }
            }

            Map<String, Object> group = new LinkedHashMap<>();
            // Định dạng Range chính xác (26–31, 26–30, v.v.)
            group.put("range", startDay + "–" + endDay);
            group.put("revenue", total);
            result.add(group);
        }

        return result;
    }

    @Override
    public Map<String, Instant> getWeekRange(int offset) {

        // 1. Lấy thời điểm hiện tại
        ZonedDateTime now = ZonedDateTime.now(zoneId);

        // 2. Tìm ngày Thứ Hai của tuần hiện tại (00:00:00)
        ZonedDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .toLocalDate()
                .atStartOfDay(zoneId);

        // 3. Điều chỉnh theo offset (Tuần này hoặc tuần trước)
        ZonedDateTime actualStart = startOfWeek.plusWeeks(offset);

        // 4. Tính thời điểm kết thúc (Thứ Hai tuần sau, 00:00:00)
        ZonedDateTime actualEnd = actualStart.plusWeeks(1);

        // 5. Trả về Map sử dụng Map.of()
        return Map.of(
                "startTime", actualStart.toInstant(),
                "endTime", actualEnd.toInstant()
        );

        // Lưu ý: Tôi đã bỏ các lệnh System.out.println để giữ cho hàm này gọn gàng.
        // Bạn nên sử dụng Logger (ví dụ: SLF4J/Log4j2) thay vì System.out.println trong production code.
    }


    @Override
    public WeeklyStatResultRepuest getWeeklyStatsInRange(Instant start, Instant end) {

        List<Order> orders = orderRepo.findByCreatedAtBetween(start, end);

        long nonPendingCount = 0;
        long nonPendingTotalAmount = 0;

        for (Order order : orders) {
            if (order.getStatus() != null &&
                    !order.getStatus().equalsIgnoreCase(EXCLUDED_STATUS)) {

                nonPendingCount++;
                // Chú ý: Chỉ tính tổng tiền của các hóa đơn đã được xử lý (non-pending)
                nonPendingTotalAmount += order.getTotalAmount();
            }
        }

        // Log kết quả thực tế (chỉ để debug)
        System.out.println("NON-PENDING ORDERS in range: " + nonPendingCount);
        System.out.println("NON-PENDING TOTAL AMOUNT in range: " + nonPendingTotalAmount);

        return new WeeklyStatResultRepuest(nonPendingCount, nonPendingTotalAmount);
    }

    @Override
    public Map<String, Object> getWeeklyStats() {
        Map<String, Object> results = new HashMap<>();

        Map<String, Instant> thisWeekRange = getWeekRange(0);
        WeeklyStatResultRepuest thisWeekStats = getWeeklyStatsInRange(
                thisWeekRange.get("startTime"),
                thisWeekRange.get("endTime")
        );
        results.put("thisWeekCount", thisWeekStats.getOrderCount());
        results.put("thisWeekAmount", thisWeekStats.getTotalAmount());

        Map<String, Instant> lastWeekRange = getWeekRange(-1);
        WeeklyStatResultRepuest lastWeekStats = getWeeklyStatsInRange(
                lastWeekRange.get("startTime"),
                lastWeekRange.get("endTime")
        );
        results.put("lastWeekCount", lastWeekStats.getOrderCount());
        results.put("lastWeekAmount", lastWeekStats.getTotalAmount());

        return results;
    }
    @Override
    public List<Order> getOrdersByMonthAndYear(int year, int month) {
        // Kiểm tra logic nghiệp vụ cơ bản (ví dụ: tháng phải từ 1 đến 12)
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Tháng không hợp lệ. Phải từ 1 đến 12.");
        }

        // Gọi hàm từ Repository
        List<Order> orders =orderRepo.findAllByMonthAndYear(year, month);

        // Có thể thêm logic nghiệp vụ khác ở đây nếu cần (ví dụ: lọc thêm, tính toán tổng,...)

        return orders;
    }

    private void checkStock(Map<String, Integer> products) {
        for (Map.Entry<String, Integer> entry : products.entrySet()) {
            String productId = entry.getKey();
            int qty = entry.getValue();

            Product product = productRepo.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

            // Giả sử check variant đầu tiên (hoặc sửa FE để gửi variantId)
            if (product.getVariants() == null || product.getVariants().isEmpty()) {
                throw new RuntimeException("Product has no variants: " + productId);
            }

            ProductVariant variant = product.getVariants().get(0);

            if (variant.getInStock() < qty) {
                throw new RuntimeException(
                        "Sản phẩm " + product.getName() + " chỉ còn " + variant.getInStock() + " sản phẩm!"
                );
            }
        }
    }

    private void reduceStock(Map<String, Integer> products) {
        for (Map.Entry<String, Integer> entry : products.entrySet()) {
            String productId = entry.getKey();
            int qty = entry.getValue();

            Product product = productRepo.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

            if (product.getVariants() == null || product.getVariants().isEmpty()) {
                throw new RuntimeException("Product has no variants: " + productId);
            }

            ProductVariant variant = product.getVariants().get(0);

            if (variant.getInStock() < qty) {
                throw new RuntimeException("Không đủ hàng trong kho cho sản phẩm: " + product.getName());
            }

            variant.setInStock(variant.getInStock() - qty);
            productRepo.save(product);
        }
    }

    @Override
    public Order updateStatus(String id, String status) {
        Order order = findById(id);

        order.setStatus(status);
        order.setUpdatedAt(Instant.now());
        return orderRepo.save(order);
    }
}