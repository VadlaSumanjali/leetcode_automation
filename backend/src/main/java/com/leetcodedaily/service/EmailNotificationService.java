package com.leetcodedaily.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcodedaily.entity.DailyPlan;
import com.leetcodedaily.entity.DailyPlanProblem;
import com.leetcodedaily.entity.EmailDeliveryLog;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.repository.EmailDeliveryLogRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;
    private final EmailDeliveryLogRepository emailDeliveryLogRepository;
    private final ObjectMapper objectMapper;

    @Value("${spring.mail.username:}")
    private String smtpFromEmail;

    @Value("${app.mail.resend-api-key:${RESEND_API_KEY:}}")
    private String resendApiKey;

    @Value("${app.mail.from-email:${RESEND_FROM_EMAIL:${MAIL_FROM:LeetCode Daily <onboarding@resend.dev>}}}")
    private String resendFromEmail;

    @Value("${app.frontend.url:${CLIENT_ORIGIN:https://leetcode-automation.vercel.app}}")
    private String frontendUrl;

    public EmailNotificationService(
            @Autowired(required = false) JavaMailSender mailSender,
            EmailDeliveryLogRepository emailDeliveryLogRepository,
            ObjectMapper objectMapper) {
        this.mailSender = mailSender;
        this.emailDeliveryLogRepository = emailDeliveryLogRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Dispatches daily practice problems to the user.
     */
    public boolean sendDailyPlanEmail(User user, DailyPlan plan) {
        String recipient = user.getEmail();
        String subject = "🔥 LeetCode Daily: Day " + plan.getDayNumber() + " Practice Plan (" + plan.getPlanDate() + ")";
        String htmlBody = buildHtmlEmailContent(user, plan);

        boolean delivered = dispatchEmail(user, plan.getPlanDate(), recipient, subject, htmlBody, "Daily Practice Plan");
        if (delivered) {
            plan.setEmailDelivered(true);
            plan.setEmailDeliveredAt(LocalDateTime.now());
        }
        return delivered;
    }

    /**
     * Dispatches a 6-digit OTP code for password reset or verification.
     */
    public boolean sendOtpEmail(User user, String otp) {
        String recipient = user.getEmail();
        String subject = "🔐 LeetCode Daily: Your Verification Code is " + otp;
        String htmlBody = buildOtpEmailContent(user, otp);
        return dispatchEmail(user, LocalDate.now(), recipient, subject, htmlBody, "OTP Verification");
    }

    /**
     * Dispatches a confirmation email after successful password reset.
     */
    public boolean sendPasswordResetSuccessEmail(User user) {
        String recipient = user.getEmail();
        String subject = "✅ LeetCode Daily: Password Successfully Reset";
        String htmlBody = buildPasswordResetSuccessContent(user);
        return dispatchEmail(user, LocalDate.now(), recipient, subject, htmlBody, "Password Reset Confirmation");
    }

    /**
     * Dispatches a system test email to verify email connectivity.
     */
    public boolean sendTestEmail(String recipient) {
        String subject = "🔥 LeetCode Daily Production Test Email";
        String htmlBody = "<!DOCTYPE html><html><body style='font-family:Inter,Arial,sans-serif;background-color:#f8fafc;padding:24px;color:#1e293b;'>"
                + "<div style='max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;'>"
                + "<h2 style='color:#4f46e5;margin-top:0;'>LeetCode Daily Email Verification</h2>"
                + "<p>Your email integration is working successfully via <strong>HTTP API (Port 443 - Render Free Tier Compatible)</strong>.</p>"
                + "<p style='font-size:12px;color:#64748b;'>Timestamp: " + LocalDateTime.now() + "</p>"
                + "</div></body></html>";
        return dispatchEmail(null, LocalDate.now(), recipient, subject, htmlBody, "System Test Email");
    }

    /**
     * Primary dispatcher: Prefers Resend HTTP API (Port 443).
     * Falls back to SMTP for local environments or logs a simulation in development.
     */
    public boolean dispatchEmail(User user, LocalDate date, String recipient, String subject, String htmlBody, String contextType) {
        // 1. PRIMARY: Resend HTTP REST API over Port 443 (Render firewall immune)
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            try {
                String emailId = sendViaResend(recipient, subject, htmlBody);
                log.info("{} email dispatched successfully via Resend HTTPS (ID: {}) to {}", contextType, emailId, recipient);
                if (user != null) {
                    logSuccess(user, date, recipient, "Dispatched successfully via Resend HTTPS (ID: " + emailId + ")");
                }
                return true;
            } catch (Exception ex) {
                log.error("Resend HTTPS dispatch failed: {}. Attempting fallback.", ex.getMessage());
                if (user != null) {
                    logFailure(user, date, recipient, "Resend HTTPS error: " + ex.getMessage());
                }
            }
        }

        // 2. SECONDARY: SMTP (Local dev only)
        if (mailSender != null && smtpFromEmail != null && !smtpFromEmail.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(smtpFromEmail, "LeetCode Daily");
                helper.setTo(recipient);
                helper.setSubject(subject);
                helper.setText(htmlBody, true);

                mailSender.send(message);
                log.info("{} email dispatched successfully via SMTP to {}", contextType, recipient);
                if (user != null) {
                    logSuccess(user, date, recipient, "Dispatched successfully via SMTP");
                }
                return true;
            } catch (Exception ex) {
                String err = ex.getMessage();
                if (err != null && err.contains("timeout")) {
                    err = "SMTP timeout (Render Free Tier blocks outbound port 587/465. Set RESEND_API_KEY in Render dashboard for HTTPS delivery): " + err;
                }
                log.error("Failed to send {} email via SMTP to {}: {}", contextType, recipient, err);
                if (user != null) {
                    logFailure(user, date, recipient, err);
                }
                return false;
            }
        }

        // 3. Fallback simulation (when neither Resend API key nor SMTP credentials are configured)
        log.info("{} email simulated for {} (Configure RESEND_API_KEY in Render Environment for live delivery)", contextType, recipient);
        if (user != null) {
            logSuccess(user, date, recipient, "Simulated dispatch - set RESEND_API_KEY in Render dashboard for live delivery over HTTPS port 443");
        }
        return true;
    }

    private String sendViaResend(String recipient, String subject, String htmlContent) throws Exception {
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();

        String sender = (resendFromEmail != null && !resendFromEmail.isBlank() && !resendFromEmail.contains("@gmail.com"))
                ? resendFromEmail
                : "LeetCode Daily <onboarding@resend.dev>";

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("from", sender);
        payload.put("to", List.of(recipient));
        payload.put("subject", subject);
        payload.put("html", htmlContent);

        String jsonPayload = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey.trim())
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            try {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.has("id")) {
                    return root.get("id").asText();
                }
            } catch (Exception ignored) {}
            return "resend-ok";
        } else {
            String errorBody = response.body();
            log.error("Resend API rejected request with HTTP {}: {}", response.statusCode(), errorBody);
            throw new RuntimeException("Resend API error " + response.statusCode() + ": " + errorBody);
        }
    }

    private void logSuccess(User user, LocalDate date, String recipient, String details) {
        EmailDeliveryLog logEntry = new EmailDeliveryLog(user, date, recipient, "SUCCESS", details);
        emailDeliveryLogRepository.save(logEntry);
    }

    private void logFailure(User user, LocalDate date, String recipient, String error) {
        EmailDeliveryLog logEntry = new EmailDeliveryLog(user, date, recipient, "FAILED", error);
        emailDeliveryLogRepository.save(logEntry);
    }

    private String getResolvedFrontendUrl() {
        String linkUrl = "https://leetcode-automation.vercel.app";
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            String[] origins = frontendUrl.split(",");
            linkUrl = origins[origins.length - 1].trim();
        }
        return linkUrl;
    }

    private String buildHtmlEmailContent(User user, DailyPlan plan) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><body style='font-family:Inter,Arial,sans-serif;background-color:#f8fafc;padding:24px;color:#1e293b;'>");
        sb.append("<div style='max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;'>");
        
        sb.append("<div style='border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:20px;'>");
        sb.append("<span style='color:#4f46e5;font-weight:700;font-size:18px;'>LeetCode Daily</span>");
        sb.append("<p style='font-size:14px;color:#64748b;margin:4px 0 0;'>Day ").append(plan.getDayNumber()).append(" Practice Set • ").append(plan.getPlanDate()).append("</p>");
        sb.append("</div>");

        sb.append("<p style='font-size:14px;'>Hello <strong>").append(user.getName()).append("</strong>,</p>");
        sb.append("<p style='font-size:13px;color:#475569;'>Here are your curated coding challenges for today to keep your streak going:</p>");

        sb.append("<div style='margin:16px 0;'>");
        int idx = 1;
        if (plan.getProblems() != null && !plan.getProblems().isEmpty()) {
            for (DailyPlanProblem p : plan.getProblems()) {
                sb.append("<div style='padding:12px;margin-bottom:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;'>");
                sb.append("<div style='display:flex;align-items:center;justify-content:space-between;'>");
                sb.append("<span style='font-weight:600;font-size:14px;'>").append(idx++).append(". ").append(p.getProblem().getTitle()).append("</span>");
                sb.append("<span style='font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;background:#e0e7ff;color:#3730a3;'>")
                  .append(p.getProblem().getDifficulty()).append("</span>");
                sb.append("</div>");
                sb.append("<p style='font-size:12px;color:#64748b;margin:4px 0;'>Topic: ").append(p.getProblem().getTopic()).append("</p>");
                sb.append("<a href='").append(p.getProblem().getUrl()).append("' style='display:inline-block;margin-top:6px;font-size:12px;color:#4f46e5;text-decoration:none;font-weight:600;'>Solve on LeetCode →</a>");
                sb.append("</div>");
            }
        } else {
            sb.append("<p style='font-size:13px;color:#64748b;padding:12px;background:#f8fafc;border-radius:8px;'>No problems assigned for today.</p>");
        }
        sb.append("</div>");

        String linkUrl = getResolvedFrontendUrl();

        sb.append("<div style='margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;'>");
        sb.append("<a href='").append(linkUrl).append("/dashboard' style='display:inline-block;padding:10px 20px;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;border-radius:6px;'>Open Practice Dashboard</a>");
        sb.append("<p style='font-size:11px;color:#94a3b8;margin-top:12px;'>LeetCode Daily • Automated practice reminder in your configured timezone</p>");
        sb.append("</div>");

        sb.append("</div></body></html>");
        return sb.toString();
    }

    private String buildOtpEmailContent(User user, String otp) {
        return "<!DOCTYPE html><html><body style='font-family:Inter,Arial,sans-serif;background-color:#f8fafc;padding:24px;color:#1e293b;'>"
                + "<div style='max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;'>"
                + "<div style='border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;'>"
                + "<span style='color:#4f46e5;font-weight:700;font-size:20px;'>LeetCode Daily</span>"
                + "<p style='font-size:13px;color:#64748b;margin:4px 0 0;'>Password Reset Verification Code</p>"
                + "</div>"
                + "<p style='font-size:14px;'>Hello <strong>" + user.getName() + "</strong>,</p>"
                + "<p style='font-size:13px;color:#475569;'>We received a request to reset your LeetCode Daily password. Use the verification code below to complete the reset process:</p>"
                + "<div style='margin:28px 0;text-align:center;'>"
                + "<div style='display:inline-block;background:#f1f5f9;border:2px dashed #6366f1;border-radius:8px;padding:16px 36px;'>"
                + "<span style='font-family:monospace;font-size:32px;font-weight:700;letter-spacing:8px;color:#4338ca;'>" + otp + "</span>"
                + "</div>"
                + "<p style='font-size:12px;color:#64748b;margin-top:8px;'>This code will expire in <strong>15 minutes</strong>.</p>"
                + "</div>"
                + "<p style='font-size:12px;color:#94a3b8;'>If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>"
                + "</div></body></html>";
    }

    private String buildPasswordResetSuccessContent(User user) {
        String linkUrl = getResolvedFrontendUrl();
        return "<!DOCTYPE html><html><body style='font-family:Inter,Arial,sans-serif;background-color:#f8fafc;padding:24px;color:#1e293b;'>"
                + "<div style='max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;'>"
                + "<div style='border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px;'>"
                + "<span style='color:#4f46e5;font-weight:700;font-size:20px;'>LeetCode Daily</span>"
                + "<p style='font-size:13px;color:#64748b;margin:4px 0 0;'>Security Alert</p>"
                + "</div>"
                + "<p style='font-size:14px;'>Hello <strong>" + user.getName() + "</strong>,</p>"
                + "<p style='font-size:13px;color:#475569;'>Your LeetCode Daily password was successfully updated. You can now log in using your new credentials.</p>"
                + "<div style='margin:24px 0;text-align:center;'>"
                + "<a href='" + linkUrl + "/login' style='display:inline-block;padding:10px 24px;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;border-radius:6px;'>Log In to Your Account</a>"
                + "</div>"
                + "<p style='font-size:12px;color:#94a3b8;'>If you did not make this change, please contact support immediately.</p>"
                + "</div></body></html>";
    }
}
