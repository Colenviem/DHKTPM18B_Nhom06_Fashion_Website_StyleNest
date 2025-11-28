package modules.config;

import modules.entity.Order;
import modules.entity.Product;
import modules.entity.ProductVariant;
import modules.repository.CategoryRepository;
import modules.repository.OrderRepository;
import modules.repository.ProductRepository;
import modules.repository.UserRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service("shopTools")
public class AiToolsConfig {

    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final CategoryRepository categoryRepo;
    private final UserRepository userRepo;

    public AiToolsConfig(ProductRepository productRepo, OrderRepository orderRepo,
                         CategoryRepository categoryRepo, UserRepository userRepo) {
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

    public record SearchRequest(String keyword) {}
    public record StockCheckRequest(String productName, String color, String size) {}
    public record DetailRequest(String productName) {}
    public record OrderStatusRequest(String orderId) {}
    public record ReturnCheckRequest(String orderId) {}
    public record CategoryRequest(String dummy) {}
    public record BestSellerRequest(int limit) {}
    public record ShippingRequest(String city, double orderValue) {}
    public record PolicyRequest(String topic) {}
    public record SupportRequest(String userEmail, String issue) {}


    @Tool(description = "Tìm kiếm sản phẩm theo tên hoặc từ khóa. Trả về danh sách có kèm link xem chi tiết.")
    public List<String> searchProducts(SearchRequest request) {
        List<Product> products = productRepo.searchProducts(request.keyword());

        if (products.isEmpty()) {
            return List.of("Không tìm thấy sản phẩm nào khớp với từ khóa '" + request.keyword() + "'.");
        }

        return products.stream()
                .limit(5)
                .map(p -> String.format("- **%s** - %,.0f đ \n  👉 [Xem chi tiết](/product/%s)",
                        p.getName(),
                        p.getPrice(),
                        p.getId()))
                .collect(Collectors.toList());
    }

    @Tool(description = "Kiểm tra tồn kho chi tiết. Nếu không rõ biến thể, sẽ báo tổng tồn kho.")
    public String checkStock(StockCheckRequest request) {

        var products = productRepo.searchProducts(request.productName());

        if (products.isEmpty()) return "Không tìm thấy sản phẩm tên là \"" + request.productName() + "\".";

        Product p = products.get(0);

        if ((request.color() == null || request.color().isEmpty()) &&
                (request.size() == null || request.size().isEmpty())) {
            return String.format("Sản phẩm **%s** hiện đang có sẵn. Vui lòng chọn màu và size cụ thể tại trang chi tiết.\n👉 [Đi tới trang sản phẩm](/product/%s)", p.getName(), p.getId());
        }

        if (p.getVariants() == null) return "Sản phẩm đang cập nhật kho.";

        int stock = p.getVariants().stream()
                .filter(v -> (request.color() == null || v.getColor().equalsIgnoreCase(request.color())) &&
                        (request.size() == null || v.getSize().equalsIgnoreCase(request.size())))
                .mapToInt(v -> v.getInStock() != null ? v.getInStock() : 0)
                .sum();

        if (stock > 0) {
            return String.format("✅ **%s** (Màu: %s, Size: %s) còn **%d** sản phẩm.\n[Đặt mua ngay](/product/%s)",
                    p.getName(), request.color(), request.size(), stock, p.getId());
        } else {
            return String.format("❌ Rất tiếc, mẫu **%s** (Màu: %s, Size: %s) đã hết hàng.",
                    p.getName(), request.color(), request.size());
        }
    }

    @Tool(description = "Lấy thông tin chi tiết sản phẩm và link mua hàng.")
    public String getProductDetails(DetailRequest request) {
        var products = productRepo.searchProducts(request.productName());

        return products.stream()
                .findFirst()
                .map(p -> String.format("""
                        📦 **%s**
                        - Giá: %,.0f đ
                        - Thương hiệu: %s
                        - Chất liệu: %s
                        - Xuất xứ: %s
                        - Mô tả: %s
                        
                        👉 [Xem chi tiết & Mua ngay](/product/%s)
                        """,
                        p.getName(), p.getPrice(), p.getBrand(), p.getMaterial(), p.getOrigin(), p.getShortDescription(), p.getId()))
                .orElse("Không tìm thấy thông tin chi tiết cho sản phẩm này.");
    }

    @Tool(description = "Kiểm tra trạng thái đơn hàng và cung cấp link theo dõi.")
    public String getOrderStatus(OrderStatusRequest request) {
        return orderRepo.findById(request.orderId())
                .map(order -> String.format("""
                        📋 Đơn hàng **%s**:
                        - Trạng thái: **%s**
                        - Cập nhật cuối: %s
                        
                        👉 [Xem chi tiết đơn hàng](/profile) (Chọn tab Lịch sử đơn hàng)
                        """, request.orderId(), order.getStatus(), order.getUpdatedAt()))
                .orElse("⚠️ Không tìm thấy mã đơn hàng này. Vui lòng kiểm tra lại ID.");
    }

    @Tool(description = "Kiểm tra điều kiện đổi trả đơn hàng.")
    public String checkReturnEligibility(ReturnCheckRequest request) {
        var orderOpt = orderRepo.findById(request.orderId());
        if (orderOpt.isEmpty()) return "Không tìm thấy đơn hàng.";

        Order order = orderOpt.get();
        if (!"Delivered".equalsIgnoreCase(order.getStatus()) && !"Completed".equalsIgnoreCase(order.getStatus())) {
            return "Đơn hàng chưa giao thành công, chưa thể đổi trả.";
        }

        Instant deliveryTime = order.getUpdatedAt() != null ? order.getUpdatedAt() : order.getCreatedAt();
        long days = ChronoUnit.DAYS.between(deliveryTime, Instant.now());
        if (days <= 7) {
            return String.format("✅ Đơn hàng đủ điều kiện đổi trả (Đã giao %d ngày).\n👉 [Tạo yêu cầu đổi trả tại đây](/profile) (Chọn đơn hàng và bấm 'Trả hàng')", days);
        } else {
            return "❌ Đã quá hạn đổi trả (" + days + " ngày). Chính sách của chúng tôi chỉ hỗ trợ trong 7 ngày.";
        }
    }

    @Tool(description = "Liệt kê danh mục sản phẩm.")
    public List<String> listCategories(CategoryRequest request) {
        return categoryRepo.findAll().stream()
                .map(c -> String.format("- [%s](/fashion?category=%s)", c.getName(), c.getId())) // Giả sử link filter theo category
                .collect(Collectors.toList());
    }

    @Tool(description = "Gợi ý Top sản phẩm bán chạy nhất.")
    public List<String> getBestSellers(BestSellerRequest request) {
        return productRepo.findAll().stream()
                .sorted((p1, p2) -> Integer.compare(p2.getSold(), p1.getSold()))
                .limit(request.limit() > 0 ? request.limit() : 5)
                .map(p -> String.format("🔥 **%s** (Đã bán: %d) - [Xem ngay](/product/%s)", p.getName(), p.getSold(), p.getId()))
                .collect(Collectors.toList());
    }

    @Tool(description = "Tính phí ship.")
    public String calculateShipping(ShippingRequest req) {
        if (req.orderValue() > 1000000) return "✨ Đơn hàng > 1 triệu được **Miễn phí vận chuyển**!";
        if (req.city().toLowerCase().contains("hồ chí minh") || req.city().toLowerCase().contains("hà nội")) {
            return "Phí ship nội thành: **30,000 đ**";
        }
        return "Phí ship tiêu chuẩn: **50,000 đ**";
    }

    @Tool(description = "Chính sách cửa hàng.")
    public String getStorePolicy(PolicyRequest req) {
        return switch (req.topic().toLowerCase()) {
            case "return", "đổi trả" -> "🔄 [Chính sách Đổi trả](/about): 7 ngày cho sản phẩm lỗi.";
            case "payment", "thanh toán" -> "💳 Hỗ trợ: COD, Visa/Mastercard, VNPay.";
            case "contact", "liên hệ" -> "📞 Hotline: 1900-xxxx\n📧 Email: support@stylenest.com\n📍 [Xem bản đồ cửa hàng](/contact)";
            default -> "Bạn cần thông tin về: đổi trả, thanh toán hay liên hệ?";
        };
    }

    @Tool(description = "Hỗ trợ kỹ thuật.")
    public String contactSupport(SupportRequest req) {
        return "✅ Đã ghi nhận yêu cầu. Chúng tôi sẽ gửi email phản hồi tới **" + req.userEmail() + "** sớm nhất.";
    }
}