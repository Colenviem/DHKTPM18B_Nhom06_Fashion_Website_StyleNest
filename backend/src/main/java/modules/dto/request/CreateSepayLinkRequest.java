package modules.dto.request;
import lombok.Data;

@Data
public class CreateSepayLinkRequest {
    private String orderId;
    private double amount; // Số tiền cần thanh toán
}