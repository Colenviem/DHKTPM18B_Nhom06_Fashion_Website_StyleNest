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

    // Lấy cấu hình từ application.yml
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

    /**
     * Tạo giao dịch thanh toán SePay và trả về link QR Code
     * Dùng cho trường hợp Backend tạo mã QR (kịch bản tối ưu)
     */
    @Override
    public PaymentTransaction createSepayTransaction(CreateSepayLinkRequest request) {
        // 1. Kiểm tra đơn hàng
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + request.getOrderId()));

        // 2. Tạo mã tham chiếu duy nhất cho giao dịch (PAY + timestamp hoặc ID)
        // Ví dụ: PAY171543 (trùng khớp với định dạng Regex ở dưới)
        String uniqueSuffix = String.valueOf(System.currentTimeMillis()).substring(7); // Lấy 6 số cuối time
        String description = "PAY" + uniqueSuffix;

        // 3. Tạo record giao dịch
        PaymentTransaction trans = new PaymentTransaction();
        trans.setOrderId(order.getId());
        trans.setAmount(request.getAmount()); // Dùng số tiền từ request hoặc order.getTotalAmount()
        trans.setCurrency("VND");
        trans.setMethod("SEPAY");
        trans.setStatus("PENDING");
        trans.setDescription(description); // Lưu mã PAY... để đối chiếu Webhook
        trans.setCreatedAt(Instant.now());

        // 4. Tạo QR Code URL
        // Format: https://qr.sepay.vn/img?acc=...&bank=...&amount=...&des=...
        String qrUrl = String.format("%s?acc=%s&bank=%s&amount=%.0f&des=%s",
                sepayQrUrl, bankAccount, bankCode, request.getAmount(), description);

        trans.setQrCodeUrl(qrUrl);

        return paymentRepository.save(trans);
    }

    /**
     * Xử lý Webhook từ SePay khi có biến động số dư
     */
    @Override
    @Transactional
    public String handleSepayWebhook(SepayWebhookRequest webhook) {
        // 1. Trích xuất mã giao dịch từ nội dung chuyển khoản
        // Content mẫu: "Thanh toan PAY040525 Ma giao dich Trace405712..."
        // Kết quả extract: "PAY040525"
        String transactionCode = extractTransactionId(webhook.getContent());

        if (transactionCode == null) {
            return "Không tìm thấy mã giao dịch (PAY...) trong nội dung chuyển khoản";
        }

        // 2. Tìm giao dịch trong Database
        // Tìm theo trường description (nơi ta đã lưu mã PAY...)
        // Bạn cần thêm method findByDescription trong PaymentTransactionRepository
        PaymentTransaction trans = paymentRepository.findByDescription(transactionCode)
                .orElse(null);

        if (trans == null) {
            // Fallback: Nếu không tìm thấy trong bảng Payment, có thể thử tìm trong bảng Order
            // nếu quy ước mã chuyển khoản là Mã đơn hàng.
            return "Giao dịch không tồn tại trong hệ thống: " + transactionCode;
        }

        // 3. Kiểm tra số tiền (Cho phép sai số nhỏ nếu cần)
        if (webhook.getTransferAmount() < trans.getAmount()) {
            return "Số tiền chuyển khoản không đủ. Yêu cầu: " + trans.getAmount() + ", Thực nhận: " + webhook.getTransferAmount();
        }

        // 4. Cập nhật trạng thái nếu chưa hoàn thành
        if (!"COMPLETED".equals(trans.getStatus())) {
            // Update PaymentTransaction
            trans.setStatus("COMPLETED");
            trans.setTransactionId(String.valueOf(webhook.getId())); // Lưu ID tham chiếu từ SePay
            trans.setUpdatedAt(Instant.now());
            paymentRepository.save(trans);

            // Update Order Status -> PAID
            Optional<Order> orderOpt = orderRepository.findById(trans.getOrderId());
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                // Logic nghiệp vụ: Chỉ update nếu đơn hàng chưa hủy hoặc chưa thanh toán
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

    /**
     * Helper: Dùng Regex để tách mã PAY... ra khỏi chuỗi nội dung hỗn độn
     */
    private String extractTransactionId(String content) {
        if (content == null) return null;

        // Regex: Tìm chuỗi bắt đầu bằng "PAY" theo sau là ít nhất 1 số
        // (PAY\d+) -> Bắt "PAY040525"
        // Nếu mã của bạn có cả chữ (VD: PAY8AF2), dùng (PAY[a-zA-Z0-9]+)
        Pattern pattern = Pattern.compile("(PAY\\d+)");
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            return matcher.group(1); // Trả về group 1 là mã tìm được
        }

        return null;
    }
    @Override
    public PaymentTransaction findByContent(String content) {
        // Tìm trong DB xem có giao dịch nào khớp mã PAY... không
        return paymentRepository.findByDescription(content).orElse(null);
    }
}