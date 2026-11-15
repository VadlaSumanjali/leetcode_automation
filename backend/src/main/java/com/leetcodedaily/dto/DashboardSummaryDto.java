package com.leetcodedaily.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryDto {
    private long totalAssigned = 0;
    private long totalSolved = 0;
    private long pendingCount = 0;
    private int currentStreak = 0;
    private int todayProgress = 0;
    private boolean onboardingCompleted = false;
    private DailyPlanDto todayPlan;
    private List<TopicProgressDto> topicProgress = new ArrayList<>();
    private DifficultyStatsDto difficultyStats = new DifficultyStatsDto();

    public DashboardSummaryDto() {}

    public long getTotalAssigned() { return totalAssigned; }
    public void setTotalAssigned(long totalAssigned) { this.totalAssigned = totalAssigned; }

    public long getTotalSolved() { return totalSolved; }
    public void setTotalSolved(long totalSolved) { this.totalSolved = totalSolved; }

    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getTodayProgress() { return todayProgress; }
    public void setTodayProgress(int todayProgress) { this.todayProgress = todayProgress; }

    public boolean isOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public DailyPlanDto getTodayPlan() { return todayPlan; }
    public void setTodayPlan(DailyPlanDto todayPlan) { this.todayPlan = todayPlan; }

    public List<TopicProgressDto> getTopicProgress() { return topicProgress; }
    public void setTopicProgress(List<TopicProgressDto> topicProgress) { this.topicProgress = topicProgress; }

    public DifficultyStatsDto getDifficultyStats() { return difficultyStats; }
    public void setDifficultyStats(DifficultyStatsDto difficultyStats) { this.difficultyStats = difficultyStats; }
}
