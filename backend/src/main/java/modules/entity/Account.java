package modules.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Accounts")
public class Account implements UserDetails { // Implement UserDetails
    @Id
    private String id;
    private String userName;
    private String passWord;
    private Role role;
    private boolean isActive;
    private String userId;
    private String verificationCode;
    private LocalDateTime verificationExpiry;

    // --- Triển khai các phương thức của UserDetails ---

    /**
     * Trả về quyền (role) của người dùng.
     * Spring Security sẽ dùng thông tin này để phân quyền.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == null) {
            return Collections.emptyList();
        }
        // Thêm tiền tố "ROLE_" là quy ước của Spring Security
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    /**
     * Trả về mật khẩu.
     */
    @Override
    public String getPassword() {
        return this.passWord;
    }

    /**
     * Trả về tên đăng nhập.
     */
    @Override
    public String getUsername() {
        return this.userName;
    }

    /**
     * Tài khoản có hết hạn không? (Chúng ta không dùng nên mặc định là true)
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Tài khoản có bị khoá không? (Chúng ta không dùng nên mặc định là true)
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Thông tin đăng nhập (mật khẩu) có hết hạn không? (Mặc định là true)
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Tài khoản đã được kích hoạt hay chưa?
     * Sử dụng trường 'isActive' của chúng ta.
     */
    @Override
    public boolean isEnabled() {
        return this.isActive;
    }
}