package modules.controller;

import modules.dto.request.CreateSepayLinkRequest;
import modules.dto.request.SepayWebhookRequest;
import modules.entity.PaymentTransaction;
import modules.service.impl.PaymentTransactionServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173") // Cho phép Frontend gọi
public class PaymentTransactionController {
    private final PaymentTransactionServiceImpl service;

    public PaymentTransactionController(PaymentTransactionServiceImpl service) {
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

    // API 1: Tạo giao dịch SePay (trả về QR Code)
    @PostMapping("/sepay/create")
    public ResponseEntity<PaymentTransaction> createSepayLink(@RequestBody CreateSepayLinkRequest request) {
        return ResponseEntity.ok(service.createSepayTransaction(request));
    }

    // API 2: Webhook nhận thông báo từ SePay
    @PostMapping("/sepay/webhook")
    public ResponseEntity<Map<String, String>> handleWebhook(@RequestBody SepayWebhookRequest webhook) {
        try {
            // Kiểm tra chỉ xử lý giao dịch nhận tiền ("in")
            if (!"in".equalsIgnoreCase(webhook.getTransferType())) {
                return ResponseEntity.ok(Map.of("message", "Ignored transfer type: " + webhook.getTransferType()));
            }

            String result = service.handleSepayWebhook(webhook);
            return ResponseEntity.ok(Map.of("success", "true", "message", result));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", "false", "message", e.getMessage()));
        }
    }
}