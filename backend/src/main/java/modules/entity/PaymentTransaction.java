package modules.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "PaymentTransactions")
public class PaymentTransaction {
    @Id
    private String id;

    private String orderId;       // Liên kết với Order
    private String userId;        // ID người dùng (nếu có)

    private String transactionId; // Mã tham chiếu giao dịch (ID từ SePay hoặc Bank)
    private double amount;        // Số tiền
    private String currency;      // Mặc định "VND"
    private String status;        // PENDING, COMPLETED, EXPIRED
    private String method;        // "SEPAY"

    // --- Các trường phục vụ SePay ---
    private String qrCodeUrl;     // Link ảnh QR Code để hiển thị lại nếu cần
    private String description;   // Nội dung chuyển khoản (Ví dụ: PAY123456)

    @CreatedDate
    private Instant createdAt;    // Thời gian tạo giao dịch

    @LastModifiedDate
    private Instant updatedAt;    // Thời gian cập nhật trạng thái (quan trọng để track webhook)
}