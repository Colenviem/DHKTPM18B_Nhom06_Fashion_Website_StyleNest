package modules.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class AccountUserRequest {
    private AccountDTO account;
    private UserDTO user;

    @Data
    public static class AccountDTO {
        private String username;
        private String role; // CUSTOMER, ADMIN, ...
        private boolean active;
        private String userId; // null khi add mới
    }

    @Data
    public static class UserDTO {
        private String firstName;
        private String lastName;
        private String email;
        private List<AddressDTO> addresses;
    }

    @Data
    public static class AddressDTO {
        private String id;
        private String street;
        private String city;
        private String phoneNumber;
        @JsonProperty("isDefault")
        private boolean isDefault;
    }
}