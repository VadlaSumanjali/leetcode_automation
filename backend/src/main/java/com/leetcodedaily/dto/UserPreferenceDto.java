package com.leetcodedaily.dto;

import com.leetcodedaily.entity.UserPreference;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

public class UserPreferenceDto {
    private Long id;
    private String experienceLevel;
    private int dailyTarget;
    private String preferredDifficulty;
    private List<String> selectedTopics;
    private boolean emailNotificationsEnabled;
    private String preferredDeliveryTime;
    private String timezone;

    public UserPreferenceDto() {}

    public static UserPreferenceDto fromEntity(UserPreference pref) {
        UserPreferenceDto dto = new UserPreferenceDto();
        dto.setId(pref.getId());
        dto.setExperienceLevel(pref.getExperienceLevel());
        dto.setDailyTarget(pref.getDailyTarget());
        dto.setPreferredDifficulty(pref.getPreferredDifficulty());
        if (pref.getSelectedTopics() != null && !pref.getSelectedTopics().isEmpty()) {
            dto.setSelectedTopics(Arrays.asList(pref.getSelectedTopics().split(",")));
        } else {
            dto.setSelectedTopics(List.of());
        }
        dto.setEmailNotificationsEnabled(pref.isEmailNotificationsEnabled());
        dto.setPreferredDeliveryTime(pref.getPreferredDeliveryTime() != null ? pref.getPreferredDeliveryTime().toString() : "06:00");
        dto.setTimezone(pref.getTimezone() != null ? pref.getTimezone() : "Asia/Kolkata");
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public int getDailyTarget() { return dailyTarget; }
    public void setDailyTarget(int dailyTarget) { this.dailyTarget = dailyTarget; }

    public String getPreferredDifficulty() { return preferredDifficulty; }
    public void setPreferredDifficulty(String preferredDifficulty) { this.preferredDifficulty = preferredDifficulty; }

    public List<String> getSelectedTopics() { return selectedTopics; }
    public void setSelectedTopics(List<String> selectedTopics) { this.selectedTopics = selectedTopics; }

    public boolean isEmailNotificationsEnabled() { return emailNotificationsEnabled; }
    public void setEmailNotificationsEnabled(boolean emailNotificationsEnabled) { this.emailNotificationsEnabled = emailNotificationsEnabled; }

    public String getPreferredDeliveryTime() { return preferredDeliveryTime; }
    public void setPreferredDeliveryTime(String preferredDeliveryTime) { this.preferredDeliveryTime = preferredDeliveryTime; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
}
