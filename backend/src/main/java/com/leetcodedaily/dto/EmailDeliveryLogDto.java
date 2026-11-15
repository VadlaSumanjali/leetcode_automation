package com.leetcodedaily.dto;

import com.leetcodedaily.entity.EmailDeliveryLog;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmailDeliveryLogDto {
    private Long id;
    private LocalDate planDate;
    private String recipientEmail;
    private String status;
    private String details;
    private LocalDateTime sentAt;

    public EmailDeliveryLogDto() {}

    public static EmailDeliveryLogDto fromEntity(EmailDeliveryLog log) {
        EmailDeliveryLogDto dto = new EmailDeliveryLogDto();
        dto.setId(log.getId());
        dto.setPlanDate(log.getPlanDate());
        dto.setRecipientEmail(log.getRecipientEmail());
        dto.setStatus(log.getStatus());
        dto.setDetails(log.getDetails());
        dto.setSentAt(log.getSentAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getPlanDate() { return planDate; }
    public void setPlanDate(LocalDate planDate) { this.planDate = planDate; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
