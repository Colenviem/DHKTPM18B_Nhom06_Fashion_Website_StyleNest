package modules.repository;

import modules.entity.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction, String> {
    Optional<PaymentTransaction> findByOrderId(String orderId);
}