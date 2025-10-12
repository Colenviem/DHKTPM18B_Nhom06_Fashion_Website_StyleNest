package modules.service;

import modules.entity.PaymentTransaction;
import modules.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentTransactionService {
    private final PaymentTransactionRepository repository;

    public PaymentTransactionService(PaymentTransactionRepository repository) {
        this.repository = repository;
    }

    public List<PaymentTransaction> findAll() {
        return repository.findAll();
    }

    public PaymentTransaction findById(String id) {
        return repository.findById(id).orElse(null);
    }
}
