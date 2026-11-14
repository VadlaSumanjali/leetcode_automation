package com.leetcodedaily.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_delivery_logs", indexes = {
    @Index(name = "idx_email_log_user_date", columnList = "user_id, plan_date")
})
public class EmailDeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "plan_date", nullable = false)
    private LocalDate planDate;

    @Column(nullable = false, length = 150)
    private String recipientEmail;

    @Column(nullable = false, length = 30)
    private String status; // SUCCESS, FAILED

    @Column(length = 500)
    private String details;

    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    public EmailDeliveryLog() {}

    public EmailDeliveryLog(User user, LocalDate planDate, String recipientEmail, String status, String details) {
        this.user = user;
        this.planDate = planDate;
        this.recipientEmail = recipientEmail;
        this.status = status;
        this.details = details;
        this.sentAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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
