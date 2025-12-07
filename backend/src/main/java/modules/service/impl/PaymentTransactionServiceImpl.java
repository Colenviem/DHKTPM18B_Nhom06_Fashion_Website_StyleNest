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

@Service
public class PaymentTransactionServiceImpl implements PaymentTransactionService {

    private final PaymentTransactionRepository paymentRepository;
    private final OrderRepository orderRepository; // Inject trực tiếp Order Repo

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

    // --- 1. Tạo Link thanh toán SePay ---
    public PaymentTransaction createSepayTransaction(CreateSepayLinkRequest request) {
        // 1. Validate Order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getTotalAmount() != request.getAmount()) {
            throw new RuntimeException("Amount mismatch! Order requires: " + order.getTotalAmount());
        }

        // 2. Tạo giao dịch PaymentTransaction (PENDING)
        PaymentTransaction trans = new PaymentTransaction();
        trans.setOrderId(order.getId());
        trans.setAmount(request.getAmount());
        trans.setCurrency("VND");
        trans.setMethod("SEPAY");
        trans.setStatus("PENDING");
        trans.setCreatedAt(Instant.now());

        // Lưu trước để có ID dùng cho content chuyển khoản
        trans = paymentRepository.save(trans);

        // 3. Tạo QR Code URL
        // Format: qr-url?acc=...&bank=...&amount=...&des=ID_GIAO_DICH
        String description = "PAY" + trans.getId(); // Nội dung: PAY + ID giao dịch
        trans.setDescription(description);

        String qrUrl = String.format("%s?acc=%s&bank=%s&amount=%.0f&des=%s",
                sepayQrUrl, bankAccount, bankCode, request.getAmount(), description);

        trans.setQrCodeUrl(qrUrl);

        return paymentRepository.save(trans);
    }

    // --- 2. Xử lý Webhook từ SePay ---
    @Transactional
    public String handleSepayWebhook(SepayWebhookRequest webhook) {
        // 1. Parse lấy PaymentTransaction ID từ content chuyển khoản
        // Giả sử content là: "PAY6570a..." hoặc "Thanh toan PAY6570a..."
        String transactionId = extractTransactionId(webhook.getContent());

        if (transactionId == null) {
            return "Không tìm thấy mã giao dịch trong nội dung chuyển khoản";
        }

        PaymentTransaction trans = paymentRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));

        // 2. Kiểm tra số tiền
        // Lưu ý: Cho phép sai số nhỏ nếu cần
        if (webhook.getTransferAmount() < trans.getAmount()) {
            return "Số tiền chuyển khoản không đủ";
        }

        // 3. Cập nhật PaymentTransaction -> COMPLETED
        trans.setStatus("COMPLETED");
        trans.setTransactionId(String.valueOf(webhook.getId())); // Lưu ID giao dịch ngân hàng
        paymentRepository.save(trans);

        // 4. Cập nhật Order Status -> PAID/PROCESSING
        // Vì đây là monolith, ta update luôn Order tại đây
        Optional<Order> orderOpt = orderRepository.findById(trans.getOrderId());
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus("PAID"); // Hoặc trạng thái nào bạn quy định
            order.setUpdatedAt(Instant.now());
            orderRepository.save(order);
        }

        return "Webhook xử lý thành công";
    }

    // Helper: Tách ID từ nội dung chuyển khoản
    private String extractTransactionId(String content) {
        // Logic: Tìm chuỗi sau chữ "PAY"
        // Ví dụ content: "MBVCB.12345.PAY6789abc.CT" -> Lấy "6789abc"
        // Bạn có thể dùng regex hoặc split tùy theo quy ước
        if (content == null) return null;

        // Cách đơn giản: Nếu quy ước description lúc tạo là "PAY" + ID
        // Ta tìm index của "PAY"
        int index = content.indexOf("PAY");
        if (index != -1) {
            // Lấy chuỗi từ sau chữ PAY (3 ký tự)
            // Cần cẩn thận nếu ID chứa ký tự đặc biệt hoặc content có text phía sau
            // Đây là logic đơn giản hóa, bạn nên regex kỹ hơn cho ID MongoDB (24 hex chars)
            String sub = content.substring(index + 3);
            // Giả sử ID mongo dài 24 ký tự
            if(sub.length() >= 24) {
                return sub.substring(0, 24);
            }
            return sub.trim();
        }
        return null;
    }
}