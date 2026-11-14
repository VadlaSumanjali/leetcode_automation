package com.leetcodedaily.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_problem_history",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_problem", columnNames = {"user_id", "problem_id"})
    },
    indexes = {
        @Index(name = "idx_uph_user_status", columnList = "user_id, status")
    }
)
public class UserProblemHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false, length = 30)
    private String status; // PENDING, ATTEMPTED, SOLVED, SKIPPED, IMPORTED

    @Column(length = 255)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    public UserProblemHistory() {}

    public UserProblemHistory(User user, Problem problem, String status) {
        this.user = user;
        this.problem = problem;
        this.status = status;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
