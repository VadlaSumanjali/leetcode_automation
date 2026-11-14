package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @Value("${spring.application.name:leetcode-daily-backend}")
    private String appName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> healthInfo = new LinkedHashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("application", appName);
        healthInfo.put("environment", activeProfile);
        healthInfo.put("javaVersion", System.getProperty("java.version"));
        healthInfo.put("serverTime", LocalDateTime.now().toString());
        healthInfo.put("message", "LeetCode Daily backend service is operational.");

        return ResponseEntity.ok(ApiResponse.success(healthInfo, "System is healthy"));
    }
}

