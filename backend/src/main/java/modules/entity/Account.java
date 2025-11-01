package modules.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Accounts")
public class Account {
    @Id
    private String id;
    private String userName;
    private String passWord;
    private Role role;
    private boolean isActive;
    private String userId;
    private String verificationCode;
    private LocalDateTime verificationExpiry;
}