package modules.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "PaymentTransactions")
public class PaymentTransaction {
    @Id
    private String id;
    private String orderId;
    private UserRef user;
    private String transactionId;
    private double amount;
    private String currency;
    private String status;
    private String method;
    @CreatedDate
    private Instant createdAt;
}