package modules.service;

import modules.entity.PaymentTransaction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PaymentTransactionService {
    List<PaymentTransaction> findAll();

    PaymentTransaction findById(String id);
}
