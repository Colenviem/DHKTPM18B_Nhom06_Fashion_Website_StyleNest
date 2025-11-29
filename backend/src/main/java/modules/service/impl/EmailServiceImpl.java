package modules.service.impl;
import modules.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Đọc API Key từ resend.api.key (đã config trong application.yml)
    @Value("${resend.api.key}")
    private String apiKey;

    @Override
    public void sendEmail(String to, String subject, String htmlContent) {

        String url = "https://api.resend.com/emails";

        Map<String, Object> body = new HashMap<>();
        // QUAN TRỌNG: Dùng onboarding@resend.dev cho gói Free
        body.put("from", "StyleNest <onboarding@resend.dev>");
        body.put("to", List.of(to));
        body.put("subject", subject);
        body.put("html", htmlContent);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey); // Sử dụng API Key làm Bearer Token

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        // Gửi qua HTTP API
        ResponseEntity<String> response =
                restTemplate.postForEntity(url, request, String.class);

        System.out.println("Resend API Response: " + response.getBody());
    }
}