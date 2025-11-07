package modules.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRef {
    @Field("id")
    private String id;
    private String userName;
}
