package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.dto.HistoryImportItem;
import com.leetcodedaily.dto.HistoryItemDto;
import com.leetcodedaily.exception.BadRequestException;
import com.leetcodedaily.service.HistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HistoryItemDto>>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<HistoryItemDto> list = historyService.getUserHistory(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(list, "Problem history retrieved"));
    }

    @PostMapping("/manual")
    public ResponseEntity<ApiResponse<HistoryItemDto>> addManual(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody HistoryImportItem item) {
        HistoryItemDto created = historyService.addManualProblem(userDetails.getUsername(), item);
        return ResponseEntity.ok(ApiResponse.success(created, "Problem recorded in history"));
    }

    @PostMapping("/csv")
    public ResponseEntity<ApiResponse<Integer>> uploadCsv(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded CSV file is empty");
        }

        List<HistoryImportItem> items = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean isHeader = true;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] parts = line.split(",");
                if (isHeader) {
                    isHeader = false;
                    // Check if first line is a header
                    if (parts[0].equalsIgnoreCase("title") || parts[0].equalsIgnoreCase("problem") || parts[0].equalsIgnoreCase("name")) {
                        continue;
                    }
                }

                String title = parts[0].trim().replace("\"", "");
                String diff = parts.length > 1 ? parts[1].trim().replace("\"", "") : "Easy";
                String topic = parts.length > 2 ? parts[2].trim().replace("\"", "") : "General";
                String status = parts.length > 3 ? parts[3].trim().replace("\"", "") : "SOLVED";

                items.add(new HistoryImportItem(title, diff, topic, status));
            }
        } catch (Exception e) {
            throw new BadRequestException("Failed to parse CSV file: " + e.getMessage());
        }

        int count = historyService.importBatchHistory(userDetails.getUsername(), items);
        return ResponseEntity.ok(ApiResponse.success(count, "Successfully imported " + count + " problems"));
    }
}
