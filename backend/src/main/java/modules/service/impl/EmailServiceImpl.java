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

    @Value("${resend.api.key}")
    private String apiKey;

    @Override
    public void sendEmail(String to, String subject, String htmlContent) {

        String url = "https://api.resend.com/emails";

        Map<String, Object> body = new HashMap<>();
        body.put("from", "HomeCraft <noreply@yourdomain.com>");
        body.put("to", List.of(to));
        body.put("subject", subject);
        body.put("html", htmlContent);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(url, request, String.class);

        System.out.println("Resend API Response: " + response.getBody());
    }
}