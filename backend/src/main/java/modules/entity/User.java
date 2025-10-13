package modules.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Users")
public class User {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String username;
    private String password;
    private String role;
    private String phoneNumber;
    private List<Address> addresses;
    private List<CouponEmbedded> coupons;
    @CreatedDate
    private Instant createdAt;
}
