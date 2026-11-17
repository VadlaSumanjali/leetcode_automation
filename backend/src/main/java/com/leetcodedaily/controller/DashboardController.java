package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.dto.DashboardSummaryDto;
import com.leetcodedaily.dto.TopicProgressDto;
import com.leetcodedaily.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping({"", "/summary"})
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(summary, "Dashboard metrics retrieved"));
    }

    @GetMapping("/topics")
    public ResponseEntity<ApiResponse<List<TopicProgressDto>>> getTopicProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(summary.getTopicProgress(), "Topic progress retrieved"));
    }
}
