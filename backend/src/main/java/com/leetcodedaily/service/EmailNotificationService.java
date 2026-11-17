package com.leetcodedaily.service;

import com.leetcodedaily.entity.DailyPlan;
import com.leetcodedaily.entity.DailyPlanProblem;
import com.leetcodedaily.entity.EmailDeliveryLog;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.repository.EmailDeliveryLogRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;
    private final EmailDeliveryLogRepository emailDeliveryLogRepository;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.mail.resend-api-key:${RESEND_API_KEY:}}")
    private String resendApiKey;

    @Value("${app.frontend.url:${CLIENT_ORIGIN:https://leetcode-automation.vercel.app}}")
    private String frontendUrl;

    public EmailNotificationService(JavaMailSender mailSender, EmailDeliveryLogRepository emailDeliveryLogRepository) {
        this.mailSender = mailSender;
        this.emailDeliveryLogRepository = emailDeliveryLogRepository;
    }

    public boolean sendDailyPlanEmail(User user, DailyPlan plan) {
        String recipient = user.getEmail();
        String subject = "🔥 LeetCode Daily: Day " + plan.getDayNumber() + " Practice Plan (" + plan.getPlanDate() + ")";
        String htmlBody = buildHtmlEmailContent(user, plan);

        // 1. If RESEND_API_KEY is configured (works on Render free tier over HTTPS without port blocks)
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            try {
                sendViaResend(recipient, subject, htmlBody);
                log.info("Daily problem email dispatched successfully via Resend HTTPS to {}", recipient);
                logSuccess(user, plan, recipient, "Dispatched successfully via Resend HTTPS");
                return true;
            } catch (Exception ex) {
                log.warn("Resend HTTPS dispatch failed: {}. Falling back to SMTP.", ex.getMessage());
            }
        }

        // 2. Standard Gmail SMTP
        try {
            if (fromEmail == null || fromEmail.isBlank()) {
                log.info("Email dispatch simulated (no MAIL_USERNAME configured) for {}", recipient);
                logSuccess(user, plan, recipient, "Simulated dispatch - mail server credentials empty");
                return true;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "LeetCode Daily");
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Daily problem email dispatched successfully to {}", recipient);
            logSuccess(user, plan, recipient, "Dispatched successfully via Gmail SMTP");
            return true;
        } catch (Exception ex) {
            String err = ex.getMessage();
            if (err != null && err.contains("timeout")) {
                err = "SMTP timeout (Render Free Tier blocks outbound port 587/465. Set RESEND_API_KEY for HTTPS delivery): " + err;
            }
            log.error("Failed to send daily problem email to {}: {}", recipient, err);
            logFailure(user, plan, recipient, err);
            return false;
        }
    }

    private void sendViaResend(String recipient, String subject, String htmlContent) throws Exception {
        java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
        String sender = (fromEmail != null && fromEmail.contains("@") && !fromEmail.contains("gmail"))
                ? fromEmail : "LeetCode Daily <onboarding@resend.dev>";
        String json = String.format("{\"from\":\"%s\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":%s}",
                sender, recipient, subject, new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(htmlContent));
        java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey.trim())
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(json))
                .build();
        java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new RuntimeException("Resend API error " + response.statusCode() + ": " + response.body());
        }
    }

    private void logSuccess(User user, DailyPlan plan, String recipient, String details) {
        EmailDeliveryLog logEntry = new EmailDeliveryLog(user, plan.getPlanDate(), recipient, "SUCCESS", details);
        emailDeliveryLogRepository.save(logEntry);
        plan.setEmailDelivered(true);
        plan.setEmailDeliveredAt(LocalDateTime.now());
    }

    private void logFailure(User user, DailyPlan plan, String recipient, String error) {
        EmailDeliveryLog logEntry = new EmailDeliveryLog(user, plan.getPlanDate(), recipient, "FAILED", error);
        emailDeliveryLogRepository.save(logEntry);
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

        String linkUrl = "https://leetcode-automation.vercel.app";
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            String[] origins = frontendUrl.split(",");
            linkUrl = origins[origins.length - 1].trim();
        }

        sb.append("<div style='margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;'>");
        sb.append("<a href='").append(linkUrl).append("/dashboard' style='display:inline-block;padding:10px 20px;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;border-radius:6px;'>Open Practice Dashboard</a>");
        sb.append("<p style='font-size:11px;color:#94a3b8;margin-top:12px;'>LeetCode Daily • Automated practice reminder in your configured timezone</p>");
        sb.append("</div>");

        sb.append("</div></body></html>");
        return sb.toString();
    }
}
