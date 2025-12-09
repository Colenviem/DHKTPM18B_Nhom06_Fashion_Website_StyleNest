package modules.entity;

import lombok.*;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    private String id;
    private ProductRef product;
    private String variantId;
    private int quantity;
    private long unitPrice;
}