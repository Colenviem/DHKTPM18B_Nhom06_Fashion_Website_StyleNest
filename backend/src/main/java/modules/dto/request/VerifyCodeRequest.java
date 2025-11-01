package modules.dto.request;

import lombok.Data;

@Data
public class VerifyCodeRequest {
    private String email;
    private String code;
    private CreateUserRequest userRequest;
}