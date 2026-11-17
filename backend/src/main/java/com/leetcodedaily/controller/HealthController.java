package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.service.EmailNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;
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

    @Value("${app.mail.resend-api-key:${RESEND_API_KEY:}}")
    private String resendApiKey;

    @Autowired(required = false)
    private DataSource dataSource;

    @Autowired(required = false)
    private EmailNotificationService emailNotificationService;

    public HealthController() {}

    public HealthController(EmailNotificationService emailNotificationService) {
        this.emailNotificationService = emailNotificationService;
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

        boolean hasResend = (resendApiKey != null && !resendApiKey.isBlank());
        healthInfo.put("resendConfigured", hasResend);
        healthInfo.put("emailDeliveryMode", hasResend ? "Resend HTTPS API (Port 443 - Cloud Firewalls Safe)" : "SMTP / Fallback Simulation");
        healthInfo.put("emailConfigured", hasResend || (mailUsername != null && !mailUsername.isBlank()));
        healthInfo.put("emailSender", mailUsername);
        healthInfo.put("message", "LeetCode Daily backend service is operational.");

        return ResponseEntity.ok(ApiResponse.success(healthInfo, "System is healthy"));
    }

    @PostMapping("/test-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendTestEmail(
            @RequestParam(required = false) String to) {
        String recipient = (to != null && !to.isBlank()) ? to : mailUsername;
        if (recipient == null || recipient.isBlank()) {
            recipient = "test@example.com";
        }

        boolean delivered = (emailNotificationService != null)
                && emailNotificationService.sendTestEmail(recipient);

        Map<String, Object> res = Map.of(
                "delivered", delivered,
                "recipient", recipient,
                "provider", (resendApiKey != null && !resendApiKey.isBlank()) ? "Resend HTTPS API" : "SMTP / Simulation",
                "timestamp", LocalDateTime.now().toString()
        );
        return ResponseEntity.ok(ApiResponse.success(res, "Test email processed successfully"));
    }

    @GetMapping("/probe-network")
    public ResponseEntity<ApiResponse<Map<String, Object>>> probeNetwork() {
        Map<String, Object> results = new LinkedHashMap<>();
        String[] hosts = {"aws-0-ap-southeast-1.pooler.supabase.com", "api.resend.com", "smtp.gmail.com"};
        int[] ports = {5432, 6543, 443, 587, 465};

        for (String host : hosts) {
            for (int port : ports) {
                if (host.contains("supabase") && port != 5432 && port != 6543) continue;
                if (host.contains("resend") && port != 443) continue;
                if (host.contains("gmail") && port != 587 && port != 465) continue;

                String target = host + ":" + port;
                try (Socket socket = new Socket()) {
                    socket.connect(new InetSocketAddress(host, port), 2500);
                    results.put(target, "OPEN");
                } catch (Exception e) {
                    results.put(target, "BLOCKED (" + e.getClass().getSimpleName() + ": " + e.getMessage() + ")");
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.success(results, "Outbound network connectivity diagnostic results"));
    }
}
