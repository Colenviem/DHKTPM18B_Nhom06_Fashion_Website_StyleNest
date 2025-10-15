package modules.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddress {
    @Field("id")
    private String id;
    private String name;
    private String street;
    private String phoneNumber;
}