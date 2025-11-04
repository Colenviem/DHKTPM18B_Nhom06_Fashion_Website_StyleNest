package modules.entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private ProductRef product;
    private int quantity;
    private double priceAtTime;
}
