package modules.dto.response;

import lombok.Data;
import modules.entity.Address;
import modules.entity.CouponEmbedded;

import java.time.Instant;
import java.util.List;

@Data
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private List<Address> addresses;
    private List<CouponEmbedded> coupons;
    private Instant createdAt;
    private String userName;
    private String role;
    private boolean isActive;
}