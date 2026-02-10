package modules.entity;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRef {
    @Field("id")
    private String id;
    private String key;
    private String name;
    private String image;
    private long price;
    private int discount;
    private String sku;
    private String color;
    private String size;

}