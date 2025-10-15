package modules.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import modules.entity.Address;
import modules.entity.CouponEmbedded;
import modules.entity.Role;

import java.util.List;

@Data
public class CreateUserRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    private List<Address> addresses;
    private List<CouponEmbedded> coupons;
    @NotBlank(message = "Username is required")
    private String userName;
    @NotBlank(message = "Password is required")
    private String password;
    @NotNull(message = "Role is required")
    private Role role;
}