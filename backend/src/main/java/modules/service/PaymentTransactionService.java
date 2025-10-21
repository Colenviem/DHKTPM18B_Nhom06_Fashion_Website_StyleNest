package modules.service;

import modules.entity.PaymentTransaction;

import java.util.List;

public interface PaymentTransactionService {
    List<PaymentTransaction> findAll();

    PaymentTransaction findById(String id);
}
