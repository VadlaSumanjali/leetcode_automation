package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired(required = false)
    private DataSource dataSource;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public HealthController() {}

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

        // Check Database info safely
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                healthInfo.put("databaseType", conn.getMetaData().getDatabaseProductName());
                healthInfo.put("databaseVersion", conn.getMetaData().getDatabaseProductVersion());
                healthInfo.put("databaseConnected", true);
            } catch (Exception e) {
                healthInfo.put("databaseConnected", false);
                healthInfo.put("databaseError", e.getMessage());
            }
        } else {
            healthInfo.put("databaseConnected", true);
            healthInfo.put("databaseType", "Auto-Managed");
        }
        healthInfo.put("databaseStatus", com.leetcodedaily.config.DatabaseConfig.lastConnectionStatus);
        healthInfo.put("datasourceUrlConfigured", com.leetcodedaily.config.DatabaseConfig.activeJdbcUrl);

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

    @GetMapping("/probe-network")
    public ResponseEntity<ApiResponse<Map<String, Object>>> probeNetwork() {
        Map<String, Object> results = new java.util.LinkedHashMap<>();
        int[] ports = {5432, 6543, 587, 465, 2525, 443};
        String[] hosts = {"aws-0-ap-southeast-1.pooler.supabase.com", "smtp.gmail.com"};
        for (String host : hosts) {
            for (int port : ports) {
                if (host.contains("supabase") && port != 5432 && port != 6543) continue;
                if (host.contains("gmail") && port != 587 && port != 465 && port != 2525 && port != 443) continue;
                try (java.net.Socket socket = new java.net.Socket()) {
                    socket.connect(new java.net.InetSocketAddress(host, port), 2500);
                    results.put(host + ":" + port, "OPEN");
                } catch (Exception e) {
                    results.put(host + ":" + port, "BLOCKED (" + e.getClass().getSimpleName() + ": " + e.getMessage() + ")");
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.success(results, "Outbound network connectivity probe completed"));
    }
}
