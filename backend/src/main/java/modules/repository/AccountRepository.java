package modules.repository;

import modules.entity.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
    Optional<Account> findByUserName(String userName);
    Optional<Account> findByUserId(String userId);
    void deleteByUserId(String userId); // Phương thức để xóa Account dựa trên userId
}