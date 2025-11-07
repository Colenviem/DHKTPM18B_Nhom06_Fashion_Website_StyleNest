// backend/src/main/java/modules/service/UserService.java
package modules.service;

import modules.entity.Address;
import modules.dto.request.CreateUserRequest;
import modules.entity.User;
import java.util.List;

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
}
