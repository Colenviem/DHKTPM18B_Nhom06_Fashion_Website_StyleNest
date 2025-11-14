// backend/src/main/java/modules/service/UserService.java
package modules.service;

import modules.dto.request.AccountUserRequest;
import modules.entity.Address;
import modules.dto.request.CreateUserRequest;
import modules.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
// ✅ Interface là hợp đồng cho lớp triển khai (UserServiceImpl)
public interface UserService {

    // Lấy tất cả người dùng
    List<User> findAll();

    // Tìm người dùng theo ID
    User findById(String id);

    // Cập nhật thông tin người dùng
    User update(String id, CreateUserRequest request);

    // Xóa người dùng
    void delete(String id);

    // Thêm địa chỉ mới cho người dùng
    Address addAddress(String userId, Address address);

    // Xóa địa chỉ theo ID
    boolean deleteAddress(String userId, String addressId);

    // Cập nhật địa chỉ của người dùng
    Address updateAddress(String userId, String addressId, Address updatedAddress);

    Address setDefaultAddress(String userId, String addressId);

    User updateUserWithAddresses(String userId, AccountUserRequest.UserDTO dto);

    User createUserWithAddresses(AccountUserRequest.UserDTO dto);
}
