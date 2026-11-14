package com.leetcodedaily.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "daily_plans",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_date", columnNames = {"user_id", "plan_date"})
    }
)
public class DailyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "plan_date", nullable = false)
    private LocalDate planDate;

    @Column(nullable = false)
    private int dayNumber = 1;

    @Column(nullable = false)
    private int targetCount = 3;

    @Column(nullable = false)
    private int completionPercentage = 0;

    @Column(nullable = false)
    private boolean emailDelivered = false;

    private LocalDateTime emailDeliveredAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "dailyPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyPlanProblem> problems = new ArrayList<>();

    public DailyPlan() {}

    public DailyPlan(User user, LocalDate planDate, int dayNumber, int targetCount) {
        this.user = user;
        this.planDate = planDate;
        this.dayNumber = dayNumber;
        this.targetCount = targetCount;
        this.completionPercentage = 0;
        this.emailDelivered = false;
        this.createdAt = LocalDateTime.now();
    }

    public void addProblem(DailyPlanProblem problem) {
        problems.add(problem);
        problem.setDailyPlan(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getPlanDate() { return planDate; }
    public void setPlanDate(LocalDate planDate) { this.planDate = planDate; }

    public int getDayNumber() { return dayNumber; }
    public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }

    public int getTargetCount() { return targetCount; }
    public void setTargetCount(int targetCount) { this.targetCount = targetCount; }

    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }

    public boolean isEmailDelivered() { return emailDelivered; }
    public void setEmailDelivered(boolean emailDelivered) { this.emailDelivered = emailDelivered; }

    public LocalDateTime getEmailDeliveredAt() { return emailDeliveredAt; }
    public void setEmailDeliveredAt(LocalDateTime emailDeliveredAt) { this.emailDeliveredAt = emailDeliveredAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<DailyPlanProblem> getProblems() { return problems; }
    public void setProblems(List<DailyPlanProblem> problems) { this.problems = problems; }
}
