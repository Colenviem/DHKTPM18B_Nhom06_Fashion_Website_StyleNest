package modules.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Field("id")
    private String id = UUID.randomUUID().toString();

    private String street;
    private String city;
    private String phoneNumber;
    @JsonProperty("isDefault")
    @Field("isDefault")
    private boolean isDefault;

    public Address(String street, String city, String phoneNumber, boolean isDefault) {
        this.id = UUID.randomUUID().toString();
        this.street = street;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.isDefault = isDefault;
    }
}
