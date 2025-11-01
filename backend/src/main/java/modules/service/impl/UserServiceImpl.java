// backend/src/main/java/modules/service/impl/UserServiceImpl.java
package modules.service.impl;

import modules.dto.request.CreateUserRequest; // ✅ Thêm import
import modules.entity.User;
import modules.repository.AccountRepository; // ✅ Thêm import
import modules.repository.UserRepository;
import modules.service.UserService; // ✅ Import interface
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service // ✅ Annotation @Service nằm ở class triển khai
public class UserServiceImpl implements UserService { // ✅ Triển khai interface UserService
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository repository;
    private final AccountRepository accountRepository;

    public UserServiceImpl(UserRepository repository, AccountRepository accountRepository) {
        this.repository = repository;
        this.accountRepository = accountRepository;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public User findById(String id) {
        // ✅ Dùng logic "orElseThrow" từ file UserService cũ của bạn (tốt hơn là "orElse(null)")
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // ✅ Chuyển toàn bộ logic từ file UserService cũ vào đây
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

    // ✅ Chuyển toàn bộ logic từ file UserService cũ vào đây
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
}