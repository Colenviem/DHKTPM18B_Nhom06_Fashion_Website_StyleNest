package modules.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import modules.entity.Address;
import modules.entity.CouponEmbedded;
import modules.entity.Role;

import java.util.List;

@Data
public class CreateUserRequest {
    @NotBlank(message = "Tên không được để trống")
    private String firstName;

    @NotBlank(message = "Họ không được để trống")
    private String lastName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;

    private List<Address> addresses;
    private List<CouponEmbedded> coupons;

    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String userName;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Mật khẩu phải dài ít nhất 8 ký tự và chứa chữ hoa, chữ thường, số và ký tự đặc biệt."
    )
    private String password;

    @NotNull(message = "Quyền không được để trống")
    private Role role;
}