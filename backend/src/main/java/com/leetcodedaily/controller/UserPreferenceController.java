package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.dto.UserPreferenceDto;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.entity.UserPreference;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.UserPreferenceRepository;
import com.leetcodedaily.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user/preferences")
public class UserPreferenceController {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public UserPreferenceController(UserRepository userRepository, UserPreferenceRepository userPreferenceRepository) {
        this.userRepository = userRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserPreferenceDto>> getPreferences(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        UserPreference pref = userPreferenceRepository.findByUser(user)
                .orElseGet(() -> {
                    UserPreference p = new UserPreference(user);
                    return userPreferenceRepository.save(p);
                });
        return ResponseEntity.ok(ApiResponse.success(UserPreferenceDto.fromEntity(pref), "Preferences retrieved"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserPreferenceDto>> updatePreferences(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {
        User user = getUser(userDetails);
        UserPreference pref = userPreferenceRepository.findByUser(user)
                .orElseGet(() -> new UserPreference(user));

        if (body.containsKey("experienceLevel")) {
            pref.setExperienceLevel(String.valueOf(body.get("experienceLevel")));
        }
        if (body.containsKey("dailyTarget")) {
            pref.setDailyTarget(Integer.parseInt(String.valueOf(body.get("dailyTarget"))));
        }
        if (body.containsKey("preferredDifficulty")) {
            pref.setPreferredDifficulty(String.valueOf(body.get("preferredDifficulty")));
        }
        if (body.containsKey("selectedTopics")) {
            Object topicsObj = body.get("selectedTopics");
            if (topicsObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> list = (List<String>) topicsObj;
                pref.setSelectedTopics(String.join(",", list));
            } else if (topicsObj instanceof String) {
                pref.setSelectedTopics((String) topicsObj);
            }
        }
        if (body.containsKey("emailNotificationsEnabled")) {
            pref.setEmailNotificationsEnabled(Boolean.parseBoolean(String.valueOf(body.get("emailNotificationsEnabled"))));
        }
        if (body.containsKey("preferredDeliveryTime")) {
            try {
                pref.setPreferredDeliveryTime(LocalTime.parse(String.valueOf(body.get("preferredDeliveryTime"))));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("timezone")) {
            pref.setTimezone(String.valueOf(body.get("timezone")));
        }

        UserPreference saved = userPreferenceRepository.save(pref);
        return ResponseEntity.ok(ApiResponse.success(UserPreferenceDto.fromEntity(saved), "Preferences updated"));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));
    }
}
