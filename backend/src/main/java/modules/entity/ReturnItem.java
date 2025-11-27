package modules.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnItem {

    private ProductRef product;
    private String variantId;
    private int quantity;
    private long refundPrice;
    private String note;
    private String status;
}