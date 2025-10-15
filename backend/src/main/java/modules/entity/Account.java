package modules.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Accounts")
public class Account {
    @Id
    private String id;
    private String userName;
    private String passWord;
    private String role;
    private boolean isActive;
    private String userId;
}
