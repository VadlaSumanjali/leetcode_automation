package com.leetcodedaily.service;

import com.leetcodedaily.dto.*;
import com.leetcodedaily.entity.*;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserProblemHistoryRepository userProblemHistoryRepository;
    private final DailyPlanService dailyPlanService;

    public DashboardService(
            UserRepository userRepository,
            UserPreferenceRepository userPreferenceRepository,
            UserProblemHistoryRepository userProblemHistoryRepository,
            DailyPlanService dailyPlanService) {
        this.userRepository = userRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.userProblemHistoryRepository = userProblemHistoryRepository;
        this.dailyPlanService = dailyPlanService;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        DashboardSummaryDto summary = new DashboardSummaryDto();
        summary.setOnboardingCompleted(user.isOnboardingCompleted());

        if (!user.isOnboardingCompleted()) {
            // New un-onboarded user: return zeroes and empty state
            summary.setTotalAssigned(0);
            summary.setTotalSolved(0);
            summary.setPendingCount(0);
            summary.setCurrentStreak(0);
            summary.setTodayProgress(0);
            return summary;
        }

        // Real counts from database
        long totalAssigned = userProblemHistoryRepository.countByUserId(user.getId());
        long totalSolved = userProblemHistoryRepository.countByUserIdAndStatus(user.getId(), "SOLVED");

        summary.setTotalAssigned(totalAssigned);
        summary.setTotalSolved(totalSolved);
        summary.setCurrentStreak(dailyPlanService.calculateCurrentStreak(user));

        // Today's active plan
        DailyPlan todayPlan = dailyPlanService.getOrCreateTodayPlan(user);
        summary.setTodayPlan(DailyPlanDto.fromEntity(todayPlan));
        summary.setTodayProgress(todayPlan.getCompletionPercentage());

        long pendingToday = todayPlan.getProblems().stream()
                .filter(p -> "PENDING".equalsIgnoreCase(p.getStatus()))
                .count();
        summary.setPendingCount(pendingToday);

        // Topic-wise progress from real user history
        List<UserProblemHistory> allHistory = userProblemHistoryRepository.findByUserIdOrderByRecordedAtDesc(user.getId());
        Map<String, int[]> topicCounts = new LinkedHashMap<>(); // [solved, total]

        UserPreference preference = userPreferenceRepository.findByUser(user).orElse(null);
        if (preference != null && preference.getSelectedTopics() != null) {
            for (String t : preference.getSelectedTopics().split(",")) {
                String trimmed = t.trim();
                if (!trimmed.isEmpty()) {
                    topicCounts.put(trimmed, new int[]{0, 0});
                }
            }
        }

        for (UserProblemHistory uph : allHistory) {
            String topic = uph.getProblem().getTopic();
            topicCounts.putIfAbsent(topic, new int[]{0, 0});
            int[] counts = topicCounts.get(topic);
            counts[1]++; // total
            if ("SOLVED".equalsIgnoreCase(uph.getStatus())) {
                counts[0]++; // solved
            }
        }

        List<TopicProgressDto> topicList = new ArrayList<>();
        for (Map.Entry<String, int[]> entry : topicCounts.entrySet()) {
            topicList.add(new TopicProgressDto(entry.getKey(), entry.getValue()[0], entry.getValue()[1]));
        }
        summary.setTopicProgress(topicList);

        // Difficulty breakdown from real solved history
        int easy = 0;
        int medium = 0;
        int hard = 0;
        for (UserProblemHistory uph : allHistory) {
            if ("SOLVED".equalsIgnoreCase(uph.getStatus())) {
                String diff = uph.getProblem().getDifficulty();
                if ("Easy".equalsIgnoreCase(diff)) easy++;
                else if ("Medium".equalsIgnoreCase(diff)) medium++;
                else if ("Hard".equalsIgnoreCase(diff)) hard++;
            }
        }
        summary.setDifficultyStats(new DifficultyStatsDto(easy, medium, hard));

        return summary;
    }
}
