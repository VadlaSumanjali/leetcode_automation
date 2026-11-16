package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<ApiResponse<Map<String, Object>>> root() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "LeetCode Daily Backend API");
        info.put("status", "UP");
        info.put("frontendUrl", "https://leetcode-automation.vercel.app");
        info.put("healthEndpoint", "/api/v1/health");
        info.put("message", "LeetCode Daily backend service is operational. Open the web interface at https://leetcode-automation.vercel.app to use the application.");
        return ResponseEntity.ok(ApiResponse.success(info, "LeetCode Daily API is operational"));
    }
}
