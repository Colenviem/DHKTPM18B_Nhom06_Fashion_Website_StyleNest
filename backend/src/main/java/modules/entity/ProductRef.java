package modules.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRef {
    @Field("id")
    private String id;
    private String name;
    private String image;
    private long price;
    private int discount;
    private String sku;
    private String color;
    private String size;
}