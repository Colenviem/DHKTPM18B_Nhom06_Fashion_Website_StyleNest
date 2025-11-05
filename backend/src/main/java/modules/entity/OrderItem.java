package modules.entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private ProductRef product;
    private String variantId;
    private int quantity;
    private double unitPrice;
}