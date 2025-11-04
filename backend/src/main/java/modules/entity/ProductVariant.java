package modules.entity;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    private String sku;
    private String color;
    private String size;
    private Integer inStock;
    private List<String> images;
}