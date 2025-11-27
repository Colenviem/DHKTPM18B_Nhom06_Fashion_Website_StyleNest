package modules.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ReturnRequestDTO {
    private String orderId;
    private String reason;
    private List<String> images;
    private List<ReturnItemRequest> items;

    @Data
    public static class ReturnItemRequest {
        private String productId;
        private String variantId;
        private int quantity;
        private String note;
    }
}