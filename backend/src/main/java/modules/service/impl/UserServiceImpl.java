// backend/src/main/java/modules/service/impl/UserServiceImpl.java
package modules.service.impl;

import modules.dto.request.AccountUserRequest;
import modules.entity.Address;
import modules.dto.request.CreateUserRequest; // ✅ Thêm import
import modules.entity.User;
import modules.repository.AccountRepository; // ✅ Thêm import
import modules.repository.UserRepository;
import modules.service.UserService; // ✅ Import interface
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service // ✅ Annotation @Service nằm ở class triển khai
public class UserServiceImpl implements UserService { // ✅ Triển khai interface UserService
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository repository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository repository, AccountRepository accountRepository, UserRepository userRepository) {
        this.repository = repository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public User findById(String id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    @Transactional
    public User update(String id, CreateUserRequest request) {
        logger.info("Updating user with ID: {}", id);
        User user = findById(id); // findById đã xử lý "not found"
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setAddresses(request.getAddresses());
        user.setCoupons(request.getCoupons());
        return repository.save(user);
    }
    @Override
    @Transactional
    public void delete(String id) {
        logger.info("Deleting user with ID: {}", id);
        if (repository.existsById(id)) {
            repository.deleteById(id);
            accountRepository.deleteByUserId(id);
        } else {
            logger.warn("User not found for deletion: {}", id);
            throw new IllegalArgumentException("User not found");
        }
    }

    @Override
    public Address addAddress(String userId, Address address) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) return null;

        if (address.getId() == null || address.getId().isEmpty()) {
            address.setId(UUID.randomUUID().toString()); // ✅ Tự sinh ID nếu thiếu
        }

        List<Address> addresses = user.getAddresses();
        if (addresses == null) addresses = new ArrayList<>();

        // Nếu đánh dấu là mặc định -> bỏ mặc định ở các địa chỉ khác
        if (address.isDefault()) {
            addresses.forEach(a -> a.setDefault(false));
        }

        addresses.add(address);
        user.setAddresses(addresses);
        repository.save(user);

        return address;
    }


    @Override
    public boolean deleteAddress(String userId, String addressId) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) {
            logger.warn("❌ Không tìm thấy userId: {}", userId);
            return false;
        }

        List<Address> addresses = user.getAddresses();
        if (addresses == null || addresses.isEmpty()) {
            logger.warn("⚠️ User {} không có địa chỉ nào", userId);
            return false;
        }

        Address toRemove = addresses.stream()
                .filter(a -> addressId.equals(a.getId())) // ✅ an toàn khi id null
                .findFirst()
                .orElse(null);

        if (toRemove == null) {
            logger.warn("❌ Không tìm thấy addressId: {} trong user {}", addressId, userId);
            return false;
        }

        addresses.remove(toRemove);
        user.setAddresses(addresses);
        repository.save(user);

        logger.info("✅ Đã xóa addressId: {} cho user {}", addressId, userId);
        return true;
    }

    @Override
    public Address updateAddress(String userId, String addressId, Address updatedAddress) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) return null;

        List<Address> addresses = user.getAddresses();
        if (addresses == null) return null;

        Address toEdit = addresses.stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElse(null);

        if (toEdit == null) return null;

        if (updatedAddress.isDefault()) {
            addresses.forEach(a -> a.setDefault(false));
        }

        toEdit.setStreet(updatedAddress.getStreet() != null ? updatedAddress.getStreet() : toEdit.getStreet());
        toEdit.setCity(updatedAddress.getCity() != null ? updatedAddress.getCity() : toEdit.getCity());
        toEdit.setPhoneNumber(updatedAddress.getPhoneNumber() != null ? updatedAddress.getPhoneNumber() : toEdit.getPhoneNumber());
        toEdit.setDefault(updatedAddress.isDefault());

        repository.save(user);
        return toEdit;
    }

    @Override
    public Address setDefaultAddress(String userId, String addressId) {
        User user = repository.findById(userId).orElse(null);
        if (user == null) return null;

        List<Address> addresses = user.getAddresses();
        if (addresses == null || addresses.isEmpty()) return null;

        addresses.forEach(addr -> addr.setDefault(false));

        Address addr = addresses.stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElse(null);

        if (addr != null) {
            addr.setDefault(true);
            repository.save(user);
        }

        return addr;
    }

    // Tạo user mới kèm addresses
    public User createUserWithAddresses(AccountUserRequest.UserDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());

        List<Address> addresses = dto.getAddresses().stream()
                .map(a -> new Address(a.getStreet(), a.getCity(), a.getPhoneNumber(), a.isDefault()))
                .collect(Collectors.toList());

        ensureSingleDefaultAddress(addresses);
        user.setAddresses(addresses);

        return userRepository.save(user);
    }

    // Cập nhật user + addresses
    public User updateUserWithAddresses(String userId, AccountUserRequest.UserDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());

        // Ghi đè danh sách addresses
        List<Address> addresses = dto.getAddresses().stream()
                .map(a -> {
                    Address addr = new Address();
                    addr.setId(a.getId() != null ? a.getId() : UUID.randomUUID().toString());
                    addr.setStreet(a.getStreet());
                    addr.setCity(a.getCity());
                    addr.setPhoneNumber(a.getPhoneNumber());

                    // 🔥 Lỗi nằm ở đây – phải dùng giá trị từ DTO
                    addr.setDefault(a.isDefault());

                    return addr;
                })
                .collect(Collectors.toList());

        ensureSingleDefaultAddress(addresses);
        user.setAddresses(addresses);

        return userRepository.save(user);
    }


    private void ensureSingleDefaultAddress(List<Address> addresses) {
        // Nếu có nhiều default → giữ cái đầu tiên, các cái khác false
        boolean defaultFound = false;
        for (Address a : addresses) {
            if (a.isDefault()) {
                if (!defaultFound) {
                    defaultFound = true;
                } else {
                    a.setDefault(false);
                }
            }
        }
        // Nếu không có default → mặc định cái đầu tiên
        if (!defaultFound && !addresses.isEmpty()) {
            addresses.get(0).setDefault(true);
        }
    }
}

