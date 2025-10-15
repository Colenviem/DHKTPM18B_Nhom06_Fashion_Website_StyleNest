package modules.controller;

import modules.entity.PaymentTransaction;
import modules.service.PaymentTransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentTransactionController {
    private final PaymentTransactionService service;

    public PaymentTransactionController(PaymentTransactionService service) {
        this.service = service;
    }

    @GetMapping
    public List<PaymentTransaction> getAllPaymentTransactions() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PaymentTransaction findById(@PathVariable String id) {
        return service.findById(id);
    }
}
