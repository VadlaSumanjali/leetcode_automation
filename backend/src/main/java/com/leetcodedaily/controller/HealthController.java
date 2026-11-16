package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/health", "/health"})
public class HealthController {

    @Value("${spring.application.name:leetcode-daily-backend}")
    private String appName;

    @Value("${spring.profiles.active:prod}")
    private String activeProfile;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    private final DataSource dataSource;
    private final JavaMailSender mailSender;

    public HealthController(DataSource dataSource, JavaMailSender mailSender) {
        this.dataSource = dataSource;
        this.mailSender = mailSender;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> healthInfo = new LinkedHashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("application", appName);
        healthInfo.put("environment", activeProfile);
        healthInfo.put("javaVersion", System.getProperty("java.version"));
        healthInfo.put("serverTime", LocalDateTime.now().toString());

        // Check Database info
        try (Connection conn = dataSource.getConnection()) {
            healthInfo.put("databaseType", conn.getMetaData().getDatabaseProductName());
            healthInfo.put("databaseVersion", conn.getMetaData().getDatabaseProductVersion());
            healthInfo.put("databaseConnected", true);
        } catch (Exception e) {
            healthInfo.put("databaseConnected", false);
            healthInfo.put("databaseError", e.getMessage());
        }

        healthInfo.put("emailConfigured", mailUsername != null && !mailUsername.isBlank());
        healthInfo.put("emailSender", mailUsername);
        healthInfo.put("message", "LeetCode Daily backend service is operational.");

        return ResponseEntity.ok(ApiResponse.success(healthInfo, "System is healthy"));
    }

    @PostMapping("/test-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendTestEmail(
            @RequestParam(required = false) String to) {
        String recipient = (to != null && !to.isBlank()) ? to : mailUsername;
        if (recipient == null || recipient.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No recipient email specified and MAIL_USERNAME is not configured"));
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailUsername, "LeetCode Daily");
            helper.setTo(recipient);
            helper.setSubject("🔥 LeetCode Daily Production Test Email");
            helper.setText("<h3>LeetCode Daily Production Email Verification</h3><p>Your Gmail SMTP integration is working successfully!</p><p>Timestamp: " + LocalDateTime.now() + "</p>", true);

            mailSender.send(message);

            Map<String, Object> res = Map.of(
                    "delivered", true,
                    "recipient", recipient,
                    "timestamp", LocalDateTime.now().toString()
            );
            return ResponseEntity.ok(ApiResponse.success(res, "Test email dispatched successfully via Gmail SMTP"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to send test email: " + e.getMessage()));
        }
    }
}
