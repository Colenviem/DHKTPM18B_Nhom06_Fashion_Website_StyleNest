// backend/src/main/java/modules/service/UserService.java
package modules.service;

import modules.entity.Address;
import modules.dto.request.CreateUserRequest;
import modules.entity.User;
import java.util.List;

// ✅ Sửa thành "interface".
// Đây là bản hợp đồng, không chứa logic code.
public interface UserService {

    List<User> findAll();

    User findById(String id);

    Address addAddress(String userId, Address address);

    boolean deleteAddress(String userId, String addressId);

    Address updateAddress(String userId, String addressId, Address updatedAddress);
}
    User update(String id, CreateUserRequest request);

    void delete(String id);
}
