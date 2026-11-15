package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.dto.OnboardingRequest;
import com.leetcodedaily.dto.UserDto;
import com.leetcodedaily.service.AuthService;
import com.leetcodedaily.service.OnboardingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;
    private final AuthService authService;

    public OnboardingController(OnboardingService onboardingService, AuthService authService) {
        this.onboardingService = onboardingService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitOnboarding(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OnboardingRequest request) {
        Map<String, Object> response = onboardingService.completeOnboarding(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Onboarding completed"));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkOnboardingStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("onboardingCompleted", user.isOnboardingCompleted()),
                "Onboarding status retrieved"
        ));
    }
}
