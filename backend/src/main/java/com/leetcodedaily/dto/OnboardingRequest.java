package com.leetcodedaily.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;

public class OnboardingRequest {

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;

    @NotEmpty(message = "Please select at least one topic")
    private List<String> topics = new ArrayList<>();

    @Min(value = 1, message = "Daily target must be at least 1")
    @Max(value = 5, message = "Daily target cannot exceed 5")
    private int dailyTarget = 3;

    @NotBlank(message = "Preferred difficulty is required")
    private String preferredDifficulty = "Mixed";

    private String preferredDeliveryTime = "06:00";

    private String timezone = "Asia/Kolkata";

    private boolean emailNotificationsEnabled = true;

    private List<HistoryImportItem> historyList = new ArrayList<>();

    public OnboardingRequest() {}

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }

    public int getDailyTarget() { return dailyTarget; }
    public void setDailyTarget(int dailyTarget) { this.dailyTarget = dailyTarget; }

    public String getPreferredDifficulty() { return preferredDifficulty; }
    public void setPreferredDifficulty(String preferredDifficulty) { this.preferredDifficulty = preferredDifficulty; }

    public String getPreferredDeliveryTime() { return preferredDeliveryTime; }
    public void setPreferredDeliveryTime(String preferredDeliveryTime) { this.preferredDeliveryTime = preferredDeliveryTime; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public boolean isEmailNotificationsEnabled() { return emailNotificationsEnabled; }
    public void setEmailNotificationsEnabled(boolean emailNotificationsEnabled) { this.emailNotificationsEnabled = emailNotificationsEnabled; }

    public List<HistoryImportItem> getHistoryList() { return historyList; }
    public void setHistoryList(List<HistoryImportItem> historyList) { this.historyList = historyList; }
}
