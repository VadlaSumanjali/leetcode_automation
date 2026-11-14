package com.leetcodedaily.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_plan_problems")
public class DailyPlanProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_plan_id", nullable = false)
    private DailyPlan dailyPlan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, ATTEMPTED, SOLVED, SKIPPED

    @Column(nullable = false)
    private boolean isCarriedForward = false;

    private LocalDateTime completedAt;

    public DailyPlanProblem() {}

    public DailyPlanProblem(DailyPlan dailyPlan, Problem problem, boolean isCarriedForward) {
        this.dailyPlan = dailyPlan;
        this.problem = problem;
        this.status = "PENDING";
        this.isCarriedForward = isCarriedForward;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DailyPlan getDailyPlan() { return dailyPlan; }
    public void setDailyPlan(DailyPlan dailyPlan) { this.dailyPlan = dailyPlan; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isCarriedForward() { return isCarriedForward; }
    public void setCarriedForward(boolean carriedForward) { isCarriedForward = carriedForward; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
