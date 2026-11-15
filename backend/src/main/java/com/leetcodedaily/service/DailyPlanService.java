package com.leetcodedaily.service;

import com.leetcodedaily.dto.DailyPlanDto;
import com.leetcodedaily.dto.DailyPlanProblemDto;
import com.leetcodedaily.entity.*;
import com.leetcodedaily.exception.BadRequestException;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DailyPlanService {

    private static final Logger log = LoggerFactory.getLogger(DailyPlanService.class);

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyPlanProblemRepository dailyPlanProblemRepository;
    private final UserProblemHistoryRepository userProblemHistoryRepository;
    private final ProblemRepository problemRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public DailyPlanService(
            DailyPlanRepository dailyPlanRepository,
            DailyPlanProblemRepository dailyPlanProblemRepository,
            UserProblemHistoryRepository userProblemHistoryRepository,
            ProblemRepository problemRepository,
            UserPreferenceRepository userPreferenceRepository) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.dailyPlanProblemRepository = dailyPlanProblemRepository;
        this.userProblemHistoryRepository = userProblemHistoryRepository;
        this.problemRepository = problemRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    @Transactional
    public DailyPlan getOrCreateTodayPlan(User user) {
        UserPreference preference = userPreferenceRepository.findByUser(user)
                .orElse(new UserPreference(user));

        ZoneId zoneId;
        try {
            zoneId = ZoneId.of(preference.getTimezone());
        } catch (Exception e) {
            zoneId = ZoneId.of("Asia/Kolkata");
        }
        LocalDate today = LocalDate.now(zoneId);

        // Check if plan already exists for today
        Optional<DailyPlan> existingPlan = dailyPlanRepository.findByUserIdAndPlanDate(user.getId(), today);
        if (existingPlan.isPresent()) {
            return existingPlan.get();
        }

        // Generate new plan for today
        return generatePlanForDate(user, preference, today);
    }

    @Transactional
    public DailyPlan generatePlanForDate(User user, UserPreference preference, LocalDate planDate) {
        Optional<DailyPlan> lastPlanOpt = dailyPlanRepository.findTopByUserIdOrderByPlanDateDesc(user.getId());

        int dayNumber = 1;
        List<Problem> carriedProblems = new ArrayList<>();

        if (lastPlanOpt.isPresent()) {
            DailyPlan lastPlan = lastPlanOpt.get();
            dayNumber = lastPlan.getDayNumber() + 1;

            // Carry forward pending problems from yesterday
            for (DailyPlanProblem dpp : lastPlan.getProblems()) {
                if ("PENDING".equalsIgnoreCase(dpp.getStatus())) {
                    carriedProblems.add(dpp.getProblem());
                }
            }
        }

        int target = preference.getDailyTarget();
        DailyPlan newPlan = new DailyPlan(user, planDate, dayNumber, target);
        newPlan = dailyPlanRepository.save(newPlan);

        // 1. Add carried forward problems
        for (Problem problem : carriedProblems) {
            DailyPlanProblem dpp = new DailyPlanProblem(newPlan, problem, true);
            newPlan.addProblem(dpp);
        }

        // 2. Determine how many new problems are needed
        int remainingSlots = Math.max(0, target - carriedProblems.size());

        if (remainingSlots > 0) {
            // Strictly exclude ALL problems the user has ever received, solved, skipped, or imported
            Set<Long> userHistoryProblemIds = userProblemHistoryRepository.findProblemIdsByUserId(user.getId());

            List<String> userTopics = Arrays.stream(preference.getSelectedTopics().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());

            String prefDifficulty = preference.getPreferredDifficulty();

            List<Problem> candidateProblems;
            if ("Mixed".equalsIgnoreCase(prefDifficulty)) {
                candidateProblems = problemRepository.findByTopics(userTopics);
            } else {
                candidateProblems = problemRepository.findByTopicsAndDifficulty(userTopics, prefDifficulty);
            }

            // Exclude problems already in user history
            List<Problem> eligibleProblems = candidateProblems.stream()
                    .filter(p -> !userHistoryProblemIds.contains(p.getId()))
                    .collect(Collectors.toList());

            // If candidates in selected topics are exhausted, fallback to all available topics
            if (eligibleProblems.size() < remainingSlots) {
                List<Problem> allProblems = problemRepository.findAll();
                List<Problem> fallback = allProblems.stream()
                        .filter(p -> !userHistoryProblemIds.contains(p.getId()))
                        .filter(p -> !eligibleProblems.contains(p))
                        .collect(Collectors.toList());
                eligibleProblems.addAll(fallback);
            }

            // Shuffle candidates to provide variety
            Collections.shuffle(eligibleProblems);

            int toAssign = Math.min(remainingSlots, eligibleProblems.size());
            for (int i = 0; i < toAssign; i++) {
                Problem assignedProblem = eligibleProblems.get(i);
                DailyPlanProblem dpp = new DailyPlanProblem(newPlan, assignedProblem, false);
                newPlan.addProblem(dpp);

                // Record in user_problem_history to guarantee duplicate prevention
                UserProblemHistory history = new UserProblemHistory(user, assignedProblem, "PENDING");
                userProblemHistoryRepository.save(history);
            }
        }

        // Calculate initial completion percentage
        calculateAndUpdateProgress(newPlan);
        return dailyPlanRepository.save(newPlan);
    }

    @Transactional
    public DailyPlanProblemDto updateProblemStatus(User user, Long problemId, String newStatus) {
        String status = newStatus.trim().toUpperCase();
        if (!Arrays.asList("PENDING", "ATTEMPTED", "SOLVED", "SKIPPED").contains(status)) {
            throw new BadRequestException("Invalid status: " + newStatus);
        }

        DailyPlan todayPlan = getOrCreateTodayPlan(user);
        DailyPlanProblem planProblem = dailyPlanProblemRepository
                .findByDailyPlanIdAndProblemId(todayPlan.getId(), problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found in today's active plan"));

        planProblem.setStatus(status);
        if ("SOLVED".equals(status)) {
            planProblem.setCompletedAt(LocalDateTime.now());
        } else {
            planProblem.setCompletedAt(null);
        }
        dailyPlanProblemRepository.save(planProblem);

        // Synchronize with UserProblemHistory
        Optional<UserProblemHistory> historyOpt = userProblemHistoryRepository
                .findByUserAndProblem(user, planProblem.getProblem());

        if (historyOpt.isPresent()) {
            UserProblemHistory history = historyOpt.get();
            history.setStatus(status);
            userProblemHistoryRepository.save(history);
        } else {
            UserProblemHistory newHistory = new UserProblemHistory(user, planProblem.getProblem(), status);
            userProblemHistoryRepository.save(newHistory);
        }

        // Recalculate plan completion percentage
        calculateAndUpdateProgress(todayPlan);
        dailyPlanRepository.save(todayPlan);

        return DailyPlanProblemDto.fromEntity(planProblem);
    }

    private void calculateAndUpdateProgress(DailyPlan plan) {
        if (plan.getProblems() == null || plan.getProblems().isEmpty()) {
            plan.setCompletionPercentage(0);
            return;
        }
        long solvedCount = plan.getProblems().stream()
                .filter(p -> "SOLVED".equalsIgnoreCase(p.getStatus()))
                .count();
        int percentage = (int) Math.round(((double) solvedCount / plan.getProblems().size()) * 100);
        plan.setCompletionPercentage(percentage);
    }

    @Transactional(readOnly = true)
    public int calculateCurrentStreak(User user) {
        List<DailyPlan> plans = dailyPlanRepository.findByUserIdOrderByPlanDateDesc(user.getId());
        if (plans.isEmpty()) {
            return 0;
        }

        int streak = 0;
        LocalDate expectedDate = LocalDate.now();

        for (DailyPlan plan : plans) {
            boolean hasSolvedProblem = plan.getProblems().stream()
                    .anyMatch(p -> "SOLVED".equalsIgnoreCase(p.getStatus()));

            if (hasSolvedProblem) {
                if (plan.getPlanDate().equals(expectedDate) || plan.getPlanDate().equals(expectedDate.minusDays(1))) {
                    streak++;
                    expectedDate = plan.getPlanDate().minusDays(1);
                } else {
                    break;
                }
            } else if (plan.getPlanDate().equals(expectedDate)) {
                // If today has no solved problems yet, allow yesterday to count for streak
                expectedDate = expectedDate.minusDays(1);
            } else {
                break;
            }
        }
        return streak;
    }
}
