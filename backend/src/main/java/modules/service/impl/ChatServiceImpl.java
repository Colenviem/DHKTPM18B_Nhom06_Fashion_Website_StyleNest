package modules.service.impl;

import modules.config.AiToolsConfig; // 1. IMPORT CLASS NÀY
import modules.dto.chat.ChatRequest;
import modules.service.ChatService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatClient chatClient;
    private final ConversationMemory conversationMemory;

    public ChatServiceImpl(ChatClient.Builder chatClientBuilder,
                           ConversationMemory conversationMemory,
                           AiToolsConfig shopTools) { // Inject Bean trực tiếp
        this.conversationMemory = conversationMemory;
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        Bạn là STYLENEST.AI - Trợ lý Mua sắm Thời trang chuyên nghiệp, thân thiện và am hiểu xu hướng.

                        === PHẦN 1: QUY TẮC BẤT DI BẤT DỊCH ===
                        1. KHÔNG DÙNG DẤU SAO (*): Dùng IN HOA để nhấn mạnh tiêu đề.
                        2. KHÔNG DÙNG BẢNG (MARKDOWN TABLE): Chỉ dùng danh sách gạch đầu dòng (-).
                        3. KHÔNG BỊA ĐẶT THÔNG TIN: Nếu không tìm thấy sản phẩm/đơn hàng, hãy nói thật và gợi ý tìm từ khóa khác.

                        === PHẦN 2: HƯỚNG DẪN XỬ LÝ DỮ LIỆU ===
                        1. XỬ LÝ TÌM KIẾM: Nếu khách hỏi chung chung (ví dụ: "có áo gì không"), hãy gọi tool 'searchProducts' với từ khóa phổ biến hoặc gọi 'getBestSellers'.
                        2. HIỂN THỊ GIÁ: Luôn định dạng tiền tệ có dấu phẩy ngăn cách và đơn vị "đ" hoặc "VND".
                        3. TƯ VẤN SIZE: Nếu khách hỏi size, hãy nhắc khách cung cấp chiều cao/cân nặng hoặc kiểm tra kho bằng tool 'checkStock'.

                        === PHẦN 3: KỊCH BẢN TRẢ LỜI ===

                        A. TÌM KIẾM SẢN PHẨM (gọi searchProducts / getBestSellers)
                        - Liệt kê sản phẩm tìm thấy: Tên, Giá, ID.
                        - Gợi ý khách xem chi tiết hoặc kiểm tra size.
                        - Nếu không có: "Rất tiếc, hiện tại shop chưa có mẫu này. Bạn tham khảo các mẫu [Sản phẩm Best Seller] nhé?"

                        B. KIỂM TRA TỒN KHO / CHI TIẾT (gọi checkStock / getProductDetails)
                        - Báo rõ còn hàng hay hết hàng.
                        - Mô tả kỹ chất liệu, xuất xứ để thuyết phục khách mua.
                        
                        C. TRA CỨU ĐƠN HÀNG (gọi getOrderStatus)
                        - Yêu cầu khách cung cấp Mã đơn hàng (Order ID) nếu chưa có.
                        - Báo trạng thái hiện tại và ngày cập nhật cuối cùng.
                        
                        D. ĐỔI TRẢ & CHÍNH SÁCH (gọi checkReturnEligibility / getStorePolicy)
                        - Kiểm tra ngày giao hàng so với hiện tại.
                        - Nếu đủ điều kiện (<= 7 ngày): Hướng dẫn quy trình đổi trả.
                        - Nếu không đủ: Giải thích nhẹ nhàng về chính sách.

                        E. TÍNH PHÍ SHIP (gọi calculateShipping)
                        - Hỏi thành phố/tỉnh của khách.
                        - Báo phí ship cụ thể hoặc tin vui "Miễn phí vận chuyển" nếu đơn > 1 triệu.

                        === PHẦN 4: ĐỊNH DẠNG CÂU TRẢ LỜI MẪU ===
                        👗 KẾT QUẢ TÌM KIẾM:
                        - Áo Thun Basic (ID: A123) - 150.000 đ
                        - Quần Jeans Slim (ID: Q456) - 350.000 đ
                        
                        💡 GỢI Ý CHO BẠN:
                        - Bạn có muốn kiểm tra size cho mẫu Áo Thun Basic không?
                        """)
                .defaultTools(shopTools)
                .build();
    }

    @Override
    public String chatBot(ChatRequest request) {
        final String userId = "default_user";
        String message = request.getMessage().trim();

        if (message.equalsIgnoreCase("reset") || message.equalsIgnoreCase("xóa")) {
            conversationMemory.clear(userId);
            return "Đã xóa lịch sử trò chuyện. Bạn cần tìm món đồ thời trang nào hôm nay?";
        }

        List<String> history = conversationMemory.get(userId);

        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("=== SYSTEM CONTEXT ===\n");
        contextBuilder.append("Current User ID: ").append(userId).append("\n");
        contextBuilder.append("Current Date: ").append(LocalDate.now()).append("\n");
        contextBuilder.append("======================\n\n");

        if (!history.isEmpty()) {
            contextBuilder.append("LỊCH SỬ HỘI THOẠI TRƯỚC ĐÓ:\n");
            for (String msg : history) {
                contextBuilder.append(msg).append("\n");
            }
            contextBuilder.append("\nTIN NHẮN MỚI CỦA USER: ").append(message);
        } else {
            contextBuilder.append("TIN NHẮN MỚI CỦA USER: ").append(message);
        }

        String response = this.chatClient.prompt()
                .user(contextBuilder.toString())
                .toolNames(
                        "searchProducts",
                        "checkStock",
                        "getProductDetails",
                        "getOrderStatus",
                        "checkReturnEligibility",
                        "listCategories",
                        "getBestSellers",
                        "calculateShipping",
                        "getStorePolicy",
                        "contactSupport"
                )
                .call()
                .content();

        conversationMemory.add(userId, "User: " + message);
        conversationMemory.add(userId, "Assistant: " + response);

        return response;
    }
}