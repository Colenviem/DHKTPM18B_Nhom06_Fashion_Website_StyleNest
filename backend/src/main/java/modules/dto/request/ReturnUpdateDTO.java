package modules.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ReturnUpdateDTO {
    private String status;
    private String adminNote;
    private List<ItemDecision> items;

    @Data
    public static class ItemDecision {
        private String productId;
        private String variantId;
        private String status;
    }
}