package modules.dto.request;
import lombok.Data;

@Data
public class SepayWebhookRequest {
    private String gateway;
    private String transactionDate;
    private String accountNumber;
    private String content;       // Nội dung CK (chứa mã giao dịch)
    private String transferType;  // "in" (nhận tiền)
    private double transferAmount;
    private String description;
    private long id;              // ID giao dịch phía SePay
}