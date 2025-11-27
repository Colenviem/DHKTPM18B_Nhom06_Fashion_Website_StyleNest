package modules.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ReturnUpdateDTO {
    private String status;        // Trạng thái chung (APPROVED / REJECTED / REFUNDED)
    private String adminNote;     // Ghi chú của Admin (Lý do từ chối)
    private List<ItemDecision> items; // Danh sách quyết định cho từng món

    @Data
    public static class ItemDecision {
        private String productId;
        private String variantId;
        private String status;    // APPROVED hoặc REJECTED
    }
}