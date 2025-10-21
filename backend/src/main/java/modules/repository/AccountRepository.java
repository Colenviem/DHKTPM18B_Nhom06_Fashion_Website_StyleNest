package modules.repository;

import modules.entity.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AccountRepository extends MongoRepository<Account, String> {
    public Optional<Account> findByUsername(String username);
}
