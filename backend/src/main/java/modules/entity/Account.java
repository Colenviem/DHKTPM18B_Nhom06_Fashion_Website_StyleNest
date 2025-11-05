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
public class Account implements UserDetails {
    @Id
    private String id;
    private String userName;
    private String passWord;
    private Role role;
    private boolean isActive;
    private String userId;
    private String verificationCode;
    private LocalDateTime verificationExpiry;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    @Override
    public String getPassword() {
        return this.passWord;
    }

    @Override
    public String getUsername() {
        return this.userName;
    }
}