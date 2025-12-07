package modules.service;

public interface EmailService {
    void sendEmail(String to, String subject, String htmlContent);
}