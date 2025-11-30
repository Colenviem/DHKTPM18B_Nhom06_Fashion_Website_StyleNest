package modules.service.impl;

import modules.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${app.brevo.api-key}")
    private String apiKey;
    private static final String SENDER_EMAIL = "trancongtinh20042004@gmail.com";
    private static final String SENDER_NAME = "StyleNest";

    @Override
    public void sendEmail(String to, String subject, String htmlContent) {

        String url = "https://api.brevo.com/v3/smtp/email";
        Map<String, Object> body = new HashMap<>();
        Map<String, String> sender = new HashMap<>();
        sender.put("name", SENDER_NAME);
        sender.put("email", SENDER_EMAIL);
        body.put("sender", sender);
        Map<String, String> toAddress = new HashMap<>();
        toAddress.put("email", to);
        body.put("to", Collections.singletonList(toAddress));
        body.put("subject", subject);
        body.put("htmlContent", htmlContent);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("✅ Brevo API Response: " + response.getBody());
        } catch (Exception e) {
            System.err.println("❌ Lỗi gửi mail qua Brevo: " + e.getMessage());
        }
    }
}