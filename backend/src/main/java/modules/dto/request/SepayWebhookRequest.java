package modules.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SepayWebhookRequest {
    private String gateway;
    private String transactionDate;
    private String accountNumber;

    private String subAccount;
    private String code;

    private String content;
    private String transferType;
    private double transferAmount;
    private String description;

    private String referenceCode;
    private long accumulated;

    private long id;
}