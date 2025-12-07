package modules.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "PaymentTransactions")
public class PaymentTransaction {
    @Id
    private String id;

    private String orderId; // Liên kết với Order
    private String userId;  // (Optional) Lưu user thực hiện

    private String transactionId; // Mã tham chiếu nội bộ hoặc từ SePay
    private double amount;
    private String currency; // "VND"
    private String status;   // PENDING, COMPLETED, EXPIRED
    private String method;   // "SEPAY"
    private String qrCodeUrl; // <--- THÊM MỚI: Link ảnh QR Code
    private String description; // Nội dung chuyển khoản

    @CreatedDate
    private Instant createdAt;
}