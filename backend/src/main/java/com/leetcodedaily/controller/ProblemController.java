package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.entity.Problem;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.entity.UserProblemHistory;
import com.leetcodedaily.exception.BadRequestException;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.ProblemRepository;
import com.leetcodedaily.repository.UserProblemHistoryRepository;
import com.leetcodedaily.repository.UserRepository;
import com.leetcodedaily.service.DailyPlanService;
import com.leetcodedaily.service.GeminiAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/problems")
public class ProblemController {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final UserProblemHistoryRepository userProblemHistoryRepository;
    private final GeminiAiService geminiAiService;
    private final DailyPlanService dailyPlanService;

    public ProblemController(
            ProblemRepository problemRepository,
            UserRepository userRepository,
            UserProblemHistoryRepository userProblemHistoryRepository,
            GeminiAiService geminiAiService,
            DailyPlanService dailyPlanService) {
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.userProblemHistoryRepository = userProblemHistoryRepository;
        this.geminiAiService = geminiAiService;
        this.dailyPlanService = dailyPlanService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProblemDetails(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));

        User user = getUser(userDetails);
        Optional<UserProblemHistory> history = userProblemHistoryRepository.findByUserAndProblem(user, problem);

        Map<String, Object> data = new HashMap<>();
        data.put("id", problem.getId());
        data.put("leetcodeId", problem.getLeetcodeId());
        data.put("title", problem.getTitle());
        data.put("difficulty", problem.getDifficulty());
        data.put("topic", problem.getTopic());
        data.put("url", problem.getUrl());
        data.put("summary", problem.getSummary());
        data.put("userStatus", history.map(UserProblemHistory::getStatus).orElse("PENDING"));

        return ResponseEntity.ok(ApiResponse.success(data, "Problem details retrieved"));
    }

    @PostMapping("/{id}/ai-hint")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHint(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));

        int level = 1;
        if (body != null && body.containsKey("level")) {
            try {
                level = Integer.parseInt(String.valueOf(body.get("level")));
            } catch (Exception ignored) {}
        }
        if (level < 1 || level > 3) level = 1;

        Map<String, Object> hint = geminiAiService.getProgressiveHint(problem, level);
        return ResponseEntity.ok(ApiResponse.success(hint, "Progressive hint generated"));
    }

    @PostMapping("/{id}/ai-explanation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExplanation(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));

        Map<String, Object> explanation = geminiAiService.getProblemExplanation(problem);
        return ResponseEntity.ok(ApiResponse.success(explanation, "Problem explanation generated"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = getUser(userDetails);
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new BadRequestException("Status is required");
        }

        // Try updating in daily plan if it's in today's active plan
        try {
            dailyPlanService.updateProblemStatus(user, id, status);
        } catch (Exception e) {
            // Otherwise update in user problem history directly
            Problem problem = problemRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));
            UserProblemHistory uph = userProblemHistoryRepository.findByUserAndProblem(user, problem)
                    .orElseGet(() -> new UserProblemHistory(user, problem, status.toUpperCase()));
            uph.setStatus(status.toUpperCase());
            userProblemHistoryRepository.save(uph);
        }

        return ResponseEntity.ok(ApiResponse.success(Map.of("problemId", id, "status", status.toUpperCase()), "Status updated"));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));
    }
}
