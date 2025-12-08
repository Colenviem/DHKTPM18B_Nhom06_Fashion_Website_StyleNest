package modules.service.impl;

import modules.dto.request.CreateSepayLinkRequest;
import modules.dto.request.SepayWebhookRequest;
import modules.entity.Order;
import modules.entity.PaymentTransaction;
import modules.repository.OrderRepository;
import modules.repository.PaymentTransactionRepository;
import modules.service.PaymentTransactionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PaymentTransactionServiceImpl implements PaymentTransactionService {

    private final PaymentTransactionRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Value("${sepay.qr-url}")
    private String sepayQrUrl;

    @Value("${sepay.bank-account}")
    private String bankAccount;

    @Value("${sepay.bank-code}")
    private String bankCode;

    public PaymentTransactionServiceImpl(PaymentTransactionRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<PaymentTransaction> findAll() {
        return paymentRepository.findAll();
    }

    @Override
    public PaymentTransaction findById(String id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Override
    public PaymentTransaction createSepayTransaction(CreateSepayLinkRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + request.getOrderId()));

        String uniqueSuffix = String.valueOf(System.currentTimeMillis()).substring(7);
        String description = "PAY" + uniqueSuffix;

        PaymentTransaction trans = new PaymentTransaction();
        trans.setOrderId(order.getId());
        trans.setAmount(request.getAmount());
        trans.setCurrency("VND");
        trans.setMethod("SEPAY");
        trans.setStatus("PENDING");
        trans.setDescription(description);
        trans.setCreatedAt(Instant.now());

        String qrUrl = String.format("%s?acc=%s&bank=%s&amount=%.0f&des=%s",
                sepayQrUrl, bankAccount, bankCode, request.getAmount(), description);

        trans.setQrCodeUrl(qrUrl);

        return paymentRepository.save(trans);
    }

    @Override
    @Transactional
    public String handleSepayWebhook(SepayWebhookRequest webhook) {
        String transactionCode = extractTransactionId(webhook.getContent());

        if (transactionCode == null) {
            return "Không tìm thấy mã giao dịch (PAY...) trong nội dung chuyển khoản";
        }

        PaymentTransaction trans = paymentRepository.findByDescription(transactionCode)
                .orElse(null);

        if (trans == null) {
            return "Giao dịch không tồn tại trong hệ thống: " + transactionCode;
        }

        if (webhook.getTransferAmount() < trans.getAmount()) {
            return "Số tiền chuyển khoản không đủ. Yêu cầu: " + trans.getAmount() + ", Thực nhận: " + webhook.getTransferAmount();
        }

        if (!"COMPLETED".equals(trans.getStatus())) {
            trans.setStatus("COMPLETED");
            trans.setTransactionId(String.valueOf(webhook.getId()));
            trans.setUpdatedAt(Instant.now());
            paymentRepository.save(trans);

            Optional<Order> orderOpt = orderRepository.findById(trans.getOrderId());
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                if (!"CANCELLED".equals(order.getStatus())) {
                    order.setStatus("PAID");
                    order.setUpdatedAt(Instant.now());
                    orderRepository.save(order);
                }
            }
            return "Thanh toán thành công cho giao dịch: " + transactionCode;
        }

        return "Giao dịch đã được xử lý trước đó: " + transactionCode;
    }
    private String extractTransactionId(String content) {
        if (content == null) return null;
        Pattern pattern = Pattern.compile("(PAY\\d+)");
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            return matcher.group(1);
        }

        return null;
    }
    @Override
    public PaymentTransaction findByContent(String content) {
        return paymentRepository.findByDescription(content).orElse(null);
    }
}