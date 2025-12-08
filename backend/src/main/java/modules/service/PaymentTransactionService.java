package modules.service;

import modules.dto.request.CreateSepayLinkRequest;
import modules.dto.request.SepayWebhookRequest;
import modules.entity.PaymentTransaction;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface PaymentTransactionService {
    List<PaymentTransaction> findAll();
    PaymentTransaction findById(String id);

    // Thêm các method mới vào Interface
    PaymentTransaction createSepayTransaction(CreateSepayLinkRequest request);
    String handleSepayWebhook(SepayWebhookRequest webhook);
    PaymentTransaction findByContent(String content);
}