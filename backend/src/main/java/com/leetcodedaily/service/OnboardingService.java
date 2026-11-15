package com.leetcodedaily.service;

import com.leetcodedaily.dto.DailyPlanDto;
import com.leetcodedaily.dto.HistoryImportItem;
import com.leetcodedaily.dto.OnboardingRequest;
import com.leetcodedaily.dto.UserDto;
import com.leetcodedaily.entity.*;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.ProblemRepository;
import com.leetcodedaily.repository.UserPreferenceRepository;
import com.leetcodedaily.repository.UserProblemHistoryRepository;
import com.leetcodedaily.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OnboardingService {

    private static final Logger log = LoggerFactory.getLogger(OnboardingService.class);

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final ProblemRepository problemRepository;
    private final UserProblemHistoryRepository userProblemHistoryRepository;
    private final DailyPlanService dailyPlanService;

    public OnboardingService(
            UserRepository userRepository,
            UserPreferenceRepository userPreferenceRepository,
            ProblemRepository problemRepository,
            UserProblemHistoryRepository userProblemHistoryRepository,
            DailyPlanService dailyPlanService) {
        this.userRepository = userRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.problemRepository = problemRepository;
        this.userProblemHistoryRepository = userProblemHistoryRepository;
        this.dailyPlanService = dailyPlanService;
    }

    @Transactional
    public Map<String, Object> completeOnboarding(String userEmail, OnboardingRequest request) {
        User user = userRepository.findByEmail(userEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        // 1. Save or update user preferences
        UserPreference preference = userPreferenceRepository.findByUser(user)
                .orElse(new UserPreference(user));

        preference.setExperienceLevel(request.getExperienceLevel());
        preference.setDailyTarget(request.getDailyTarget());
        preference.setPreferredDifficulty(request.getPreferredDifficulty());
        preference.setSelectedTopics(String.join(",", request.getTopics()));
        preference.setEmailNotificationsEnabled(request.isEmailNotificationsEnabled());

        if (request.getPreferredDeliveryTime() != null && !request.getPreferredDeliveryTime().isBlank()) {
            try {
                preference.setPreferredDeliveryTime(LocalTime.parse(request.getPreferredDeliveryTime(), DateTimeFormatter.ofPattern("HH:mm")));
            } catch (Exception e) {
                preference.setPreferredDeliveryTime(LocalTime.of(6, 0));
            }
        }

        if (request.getTimezone() != null && !request.getTimezone().isBlank()) {
            preference.setTimezone(request.getTimezone());
        }

        userPreferenceRepository.save(preference);

        // 2. Import historical problems if provided (CSV / manual)
        if (request.getHistoryList() != null && !request.getHistoryList().isEmpty()) {
            for (HistoryImportItem item : request.getHistoryList()) {
                if (item.getTitle() == null || item.getTitle().isBlank()) continue;

                String title = item.getTitle().trim();
                Optional<Problem> existingProblemOpt = problemRepository.findByTitleIgnoreCase(title);

                Problem problem;
                if (existingProblemOpt.isPresent()) {
                    problem = existingProblemOpt.get();
                } else {
                    int pseudoId = 10000 + Math.abs(title.hashCode() % 90000);
                    String diff = item.getDifficulty() != null ? item.getDifficulty() : "Easy";
                    String topic = item.getTopic() != null ? item.getTopic() : "General";
                    problem = new Problem(pseudoId, title, diff, topic, "https://leetcode.com/problemset/all/", "Imported history problem");
                    problem = problemRepository.save(problem);
                }

                if (!userProblemHistoryRepository.existsByUserAndProblem(user, problem)) {
                    String status = item.getStatus() != null ? item.getStatus().toUpperCase() : "SOLVED";
                    UserProblemHistory history = new UserProblemHistory(user, problem, status);
                    userProblemHistoryRepository.save(history);
                }
            }
        }

        // 3. Mark user onboarding as complete
        user.setOnboardingCompleted(true);
        User savedUser = userRepository.save(user);

        // 4. Generate user's initial personalized daily plan immediately
        DailyPlan firstPlan = dailyPlanService.getOrCreateTodayPlan(savedUser);

        Map<String, Object> result = new HashMap<>();
        result.put("user", UserDto.fromEntity(savedUser));
        result.put("plan", DailyPlanDto.fromEntity(firstPlan));
        result.put("message", "Onboarding completed successfully. Your Day 1 plan is ready!");

        return result;
    }
}
