package modules.service;

import modules.dto.request.CreateUserRequest;
import modules.entity.User;
import modules.repository.AccountRepository;
import modules.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository repository;
    private final AccountRepository accountRepository; // ✅ thêm dòng này

    // ✅ Constructor Injection cho cả hai repository
    public UserService(UserRepository repository, AccountRepository accountRepository) {
        this.repository = repository;
        this.accountRepository = accountRepository;
    }

    public List<User> findAll() {
        return repository.findAll();
    }

    public User findById(String id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public User update(String id, CreateUserRequest request) {
        logger.info("Updating user with ID: {}", id);
        User user = findById(id);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setAddresses(request.getAddresses());
        user.setCoupons(request.getCoupons());
        return repository.save(user);
    }

    @Transactional
    public void delete(String id) {
        logger.info("Deleting user with ID: {}", id);
        if (repository.existsById(id)) {
            repository.deleteById(id);
            accountRepository.deleteByUserId(id); // ✅ giờ sẽ hoạt động bình thường
        } else {
            logger.warn("User not found for deletion: {}", id);
            throw new IllegalArgumentException("User not found");
        }
    }
}