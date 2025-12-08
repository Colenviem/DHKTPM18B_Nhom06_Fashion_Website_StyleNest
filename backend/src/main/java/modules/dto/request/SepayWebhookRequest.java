package modules.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Cực kỳ quan trọng: Bỏ qua các trường lạ nếu SePay cập nhật API trong tương lai
public class SepayWebhookRequest {
    private String gateway;
    private String transactionDate;
    private String accountNumber;

    // Các trường bổ sung cho khớp với JSON thực tế
    private String subAccount;
    private String code;

    private String content;       // Nội dung CK (chứa mã giao dịch PAY...)
    private String transferType;  // "in" (nhận tiền)
    private double transferAmount;
    private String description;

    private String referenceCode; // QUAN TRỌNG: Mã tham chiếu ngân hàng (FT2534...)
    private long accumulated;     // Số dư lũy kế (nếu có)

    private long id;              // ID giao dịch phía SePay
}