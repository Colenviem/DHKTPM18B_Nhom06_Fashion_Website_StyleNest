package modules.service.impl;

import modules.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Sửa lại đường dẫn property cho khớp với file yml mới
    @Value("${app.brevo.api-key}")
    private String apiKey;

    @Value("${app.brevo.sender-email}")
    private String senderEmail;

    @Value("${app.brevo.sender-name}")
    private String senderName;

    @Override
    public void sendEmail(String to, String subject, String htmlContent) {
        String url = "https://api.brevo.com/v3/smtp/email";

        // Validate API Key trước khi gửi
        if (apiKey == null || apiKey.contains("REPLACE_WITH_YOUR_REAL_KEY")) {
            System.err.println("❌ LỖI: Chưa cấu hình Brevo API Key đúng!");
            return;
        }

        // Tạo Body request
        Map<String, Object> body = new HashMap<>();
        Map<String, String> sender = new HashMap<>();
        sender.put("name", senderName);
        sender.put("email", senderEmail);

        Map<String, String> toAddress = new HashMap<>();
        toAddress.put("email", to);

        body.put("sender", sender);
        body.put("to", Collections.singletonList(toAddress));
        body.put("subject", subject);
        body.put("htmlContent", htmlContent);

        // Tạo Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode() == HttpStatus.CREATED || response.getStatusCode() == HttpStatus.OK) {
                System.out.println("✅ Email đã gửi thành công tới: " + to);
            }
        } catch (HttpClientErrorException e) {
            // In ra lỗi chi tiết từ Brevo (VD: Email chưa verify, hết quota...)
            System.err.println("❌ Lỗi Brevo API (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("❌ Lỗi hệ thống khi gửi mail: " + e.getMessage());
            e.printStackTrace();
        }
    }
}