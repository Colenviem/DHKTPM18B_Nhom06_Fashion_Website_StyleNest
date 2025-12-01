package modules.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Coupons")
public class Coupon {
    @Id
    private String id;
    private String code;
    private String type;
    private double discount;
    private String description;
    private long minimumOrderAmount;
    private Instant expirationDate;
    private int usageLimit;
    private int usedCount;
    private boolean active;
}