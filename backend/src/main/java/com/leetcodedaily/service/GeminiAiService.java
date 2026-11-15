package com.leetcodedaily.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcodedaily.entity.Problem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);

    private final String apiKey;
    private final String model;
    private final String endpoint;
    private final ObjectMapper objectMapper;

    public GeminiAiService(
            @Value("${app.gemini.api-key:}") String apiKey,
            @Value("${app.gemini.model:gemini-1.5-flash}") String model,
            @Value("${app.gemini.endpoint:https://generativelanguage.googleapis.com/v1beta/models}") String endpoint,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.model = model;
        this.endpoint = endpoint;
        this.objectMapper = objectMapper;
    }

    /**
     * Progressive hint levels:
     * 1: Intuition / Conceptual guiding question
     * 2: Optimal Data Structure / Pattern hint
     * 3: Detailed algorithm walk-through / pseudo-logic
     */
    public Map<String, Object> getProgressiveHint(Problem problem, int level) {
        String prompt = buildHintPrompt(problem, level);
        String aiResponse = callGemini(prompt);

        if (aiResponse == null || aiResponse.isBlank()) {
            aiResponse = getFallbackHint(problem, level);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("level", level);
        result.put("title", getHintTitle(level));
        result.put("content", aiResponse.trim());
        result.put("source", apiKey != null && !apiKey.isBlank() ? "gemini" : "algorithmic_curated");
        return result;
    }

    public Map<String, Object> getProblemExplanation(Problem problem) {
        String prompt = "You are a master algorithms teacher. Provide a concise, clear breakdown of LeetCode problem: '"
                + problem.getTitle() + "' (Difficulty: " + problem.getDifficulty() + ", Topic: " + problem.getTopic() + ").\n"
                + "Provide:\n"
                + "1. Core Optimal Approach\n"
                + "2. Step-by-step algorithm\n"
                + "3. Time Complexity with reason\n"
                + "4. Space Complexity with reason\n"
                + "Keep your response well-structured and under 250 words.";

        String aiResponse = callGemini(prompt);
        if (aiResponse == null || aiResponse.isBlank()) {
            aiResponse = getFallbackExplanation(problem);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("problemId", problem.getId());
        result.put("title", problem.getTitle());
        result.put("explanation", aiResponse.trim());
        result.put("source", apiKey != null && !apiKey.isBlank() ? "gemini" : "algorithmic_curated");
        return result;
    }

    private String callGemini(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.debug("Gemini API key is not configured; using curated algorithmic engine.");
            return null;
        }

        try {
            String urlStr = String.format("%s/%s:generateContent?key=%s", endpoint, model, apiKey);
            URL url = URI.create(urlStr).toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(10000);
            conn.setDoOutput(true);

            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> partsMap = Map.of("parts", List.of(textPart));
            Map<String, Object> requestBodyMap = Map.of("contents", List.of(partsMap));
            String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = requestBodyJson.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int code = conn.getResponseCode();
            if (code == 200) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    JsonNode root = objectMapper.readTree(br);
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && !candidates.isEmpty()) {
                        JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                        if (!textNode.isMissingNode()) {
                            return textNode.asText();
                        }
                    }
                }
            } else {
                log.warn("Gemini API returned status {}", code);
            }
        } catch (Exception e) {
            log.warn("Gemini API call failed: {}", e.getMessage());
        }
        return null;
    }

    private String buildHintPrompt(Problem problem, int level) {
        String base = String.format("You are an expert DSA mentor. The student is working on '%s' (Topic: %s, Difficulty: %s).\n",
                problem.getTitle(), problem.getTopic(), problem.getDifficulty());

        switch (level) {
            case 1:
                return base + "Provide Level 1 Hint: Intuition only. Ask a thought-provoking guiding question without giving away the data structure or solution. Maximum 2 sentences.";
            case 2:
                return base + "Provide Level 2 Hint: Pattern & Data Structure. Explain which data structure or algorithmic pattern (e.g., Two Pointers, Monotonic Stack, DP memoization) solves this optimally and why. Maximum 3 sentences.";
            case 3:
            default:
                return base + "Provide Level 3 Hint: Algorithm logic walkthrough. Provide the step-by-step logic and edge cases to watch out for. Do not write full code, guide them to write it. Maximum 4 sentences.";
        }
    }

    private String getHintTitle(int level) {
        return switch (level) {
            case 1 -> "Level 1: Intuition & Guiding Question";
            case 2 -> "Level 2: Optimal Pattern & Data Structure";
            case 3 -> "Level 3: Algorithmic Logic & Edge Cases";
            default -> "Hint";
        };
    }

    private String getFallbackHint(Problem problem, int level) {
        String topic = problem.getTopic();
        return switch (level) {
            case 1 -> "Think about the problem's constraints: Can you check if each element's required counterpart or valid condition can be identified in a single pass instead of nested comparisons?";
            case 2 -> "In " + topic + ", think about using an appropriate state tracker (such as a Hash Map for O(1) lookups, Two Pointers if sorted, or a Monotonic Stack) to avoid redundant evaluations.";
            case 3 -> "Iterate through the input while maintaining the invariant state. For each step, verify boundary conditions, check if the current state satisfies your target, and update your tracker accordingly.";
            default -> "Focus on simplifying the problem into smaller subproblems or invariant states.";
        };
    }

    private String getFallbackExplanation(Problem problem) {
        return "### Approach for " + problem.getTitle() + "\n\n"
                + "**Category:** " + problem.getTopic() + " (" + problem.getDifficulty() + ")\n\n"
                + "**Optimal Strategy:**\n"
                + "By leveraging key properties of " + problem.getTopic() + ", we can solve this problem in optimal time. "
                + "Rather than using a brute-force approach which checks all combinations, we maintain an active tracker "
                + "to evaluate constraints in a single structured traversal.\n\n"
                + "**Complexity Analysis:**\n"
                + "- **Time Complexity:** O(N) or O(N log N) depending on required ordering/sorting.\n"
                + "- **Space Complexity:** O(1) auxiliary space (or O(N) if caching states).";
    }
}
