package modules.service.impl;

import modules.entity.PaymentTransaction;
import modules.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentTransactionServiceImpl implements modules.service.PaymentTransactionService {
    private final PaymentTransactionRepository repository;

    public PaymentTransactionServiceImpl(PaymentTransactionRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<PaymentTransaction> findAll() {
        return repository.findAll();
    }

    @Override
    public PaymentTransaction findById(String id) {
        return repository.findById(id).orElse(null);
    }
}
