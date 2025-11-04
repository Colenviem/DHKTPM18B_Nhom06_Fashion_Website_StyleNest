package modules.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponEmbedded {
    @Field("id")
    private String id;
    private String code;
    private int discount;
    private String description;
    private String type;
    private long minimumOrderAmount;
    private Instant expirationDate;
    private boolean isUsed;
    private boolean isActive;
}