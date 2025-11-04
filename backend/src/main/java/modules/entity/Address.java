package modules.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Field("id")
    private String id;
    private String street;
    private String city;
    private String phoneNumber;
    private boolean isDefault;
}
