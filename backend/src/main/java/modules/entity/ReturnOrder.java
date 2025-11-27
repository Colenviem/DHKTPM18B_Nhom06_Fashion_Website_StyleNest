package modules.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ReturnOrders")
public class ReturnOrder {

    @Id
    private String id;
    private String orderId;
    private String userId;
    private List<ReturnItem> items;
    private List<String> images;
    private String reason;
    private long totalRefundAmount;
    private String status;
    private String adminNote;
    private String approvedBy;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}