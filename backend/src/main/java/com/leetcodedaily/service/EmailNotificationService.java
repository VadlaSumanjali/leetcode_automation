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

    public EmailNotificationService(JavaMailSender mailSender, EmailDeliveryLogRepository emailDeliveryLogRepository) {
        this.mailSender = mailSender;
        this.emailDeliveryLogRepository = emailDeliveryLogRepository;
    }

    public boolean sendDailyPlanEmail(User user, DailyPlan plan) {
        String recipient = user.getEmail();
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
            helper.setSubject("🔥 LeetCode Daily: Day " + plan.getDayNumber() + " Practice Plan (" + plan.getPlanDate() + ")");

            String htmlBody = buildHtmlEmailContent(user, plan);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Daily problem email dispatched successfully to {}", recipient);
            logSuccess(user, plan, recipient, "Dispatched successfully via Gmail SMTP");
            return true;
        } catch (Exception ex) {
            log.error("Failed to send daily problem email to {}: {}", recipient, ex.getMessage());
            logFailure(user, plan, recipient, ex.getMessage());
            return false;
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
        sb.append("</div>");

        sb.append("<div style='margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;'>");
        sb.append("<a href='http://localhost:5173/dashboard' style='display:inline-block;padding:10px 20px;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;border-radius:6px;'>Open Practice Dashboard</a>");
        sb.append("<p style='font-size:11px;color:#94a3b8;margin-top:12px;'>LeetCode Daily • Automated practice reminder in your configured timezone</p>");
        sb.append("</div>");

        sb.append("</div></body></html>");
        return sb.toString();
    }
}
