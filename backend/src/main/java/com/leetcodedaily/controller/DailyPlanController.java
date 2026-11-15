package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.dto.DailyPlanDto;
import com.leetcodedaily.dto.DailyPlanProblemDto;
import com.leetcodedaily.dto.EmailDeliveryLogDto;
import com.leetcodedaily.entity.DailyPlan;
import com.leetcodedaily.entity.EmailDeliveryLog;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.EmailDeliveryLogRepository;
import com.leetcodedaily.repository.UserRepository;
import com.leetcodedaily.service.DailyPlanService;
import com.leetcodedaily.service.EmailNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/plans")
public class DailyPlanController {

    private final DailyPlanService dailyPlanService;
    private final UserRepository userRepository;
    private final EmailNotificationService emailNotificationService;
    private final EmailDeliveryLogRepository emailDeliveryLogRepository;

    public DailyPlanController(
            DailyPlanService dailyPlanService,
            UserRepository userRepository,
            EmailNotificationService emailNotificationService,
            EmailDeliveryLogRepository emailDeliveryLogRepository) {
        this.dailyPlanService = dailyPlanService;
        this.userRepository = userRepository;
        this.emailNotificationService = emailNotificationService;
        this.emailDeliveryLogRepository = emailDeliveryLogRepository;
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<DailyPlanDto>> getTodayPlan(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        DailyPlan plan = dailyPlanService.getOrCreateTodayPlan(user);
        return ResponseEntity.ok(ApiResponse.success(DailyPlanDto.fromEntity(plan), "Today's plan retrieved"));
    }

    @PatchMapping("/problems/{problemId}/status")
    public ResponseEntity<ApiResponse<DailyPlanProblemDto>> updateProblemStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long problemId,
            @RequestBody Map<String, String> body) {
        User user = getUser(userDetails);
        String status = body.get("status");
        DailyPlanProblemDto updated = dailyPlanService.updateProblemStatus(user, problemId, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Problem status updated"));
    }

    @PostMapping("/send-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendPlanEmail(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        DailyPlan plan = dailyPlanService.getOrCreateTodayPlan(user);
        boolean sent = emailNotificationService.sendDailyPlanEmail(user, plan);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                        "sent", sent,
                        "recipient", user.getEmail(),
                        "planDate", plan.getPlanDate().toString(),
                        "problemsCount", plan.getProblems().size()
                ),
                sent ? "Daily plan email dispatched successfully" : "Failed to dispatch email (check mail settings)"
        ));
    }

    @GetMapping("/email-logs")
    public ResponseEntity<ApiResponse<List<EmailDeliveryLogDto>>> getEmailLogs(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<EmailDeliveryLog> logs = emailDeliveryLogRepository.findByUserIdOrderBySentAtDesc(user.getId());
        List<EmailDeliveryLogDto> dtos = logs.stream()
                .map(EmailDeliveryLogDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos, "Email delivery logs retrieved"));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));
    }
}
