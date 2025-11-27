package modules.repository;

import modules.entity.ReturnOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnOrderRepository extends MongoRepository<ReturnOrder, String> {
    List<ReturnOrder> findByUserId(String userId);
    List<ReturnOrder> findByOrderId(String orderId);
    List<ReturnOrder> findByStatus(String status);
}