package modules.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Orders")
public class Order {
    @Id
    private String id;
    private UserRef user;
    private String orderNumber;
    private String status;
    private ShippingAddress shippingAddress;
    private List<OrderItem> items;
    private double subtotal;
    private double shippingFee;
    private String couponCode;
    private double discountAmount;
    private double totalAmount;
    private String paymentMethod;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}