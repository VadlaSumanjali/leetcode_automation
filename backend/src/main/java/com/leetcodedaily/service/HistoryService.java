package com.leetcodedaily.service;

import com.leetcodedaily.dto.HistoryImportItem;
import com.leetcodedaily.dto.HistoryItemDto;
import com.leetcodedaily.entity.Problem;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.entity.UserProblemHistory;
import com.leetcodedaily.exception.BadRequestException;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.ProblemRepository;
import com.leetcodedaily.repository.UserProblemHistoryRepository;
import com.leetcodedaily.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final UserProblemHistoryRepository userProblemHistoryRepository;

    public HistoryService(
            UserRepository userRepository,
            ProblemRepository problemRepository,
            UserProblemHistoryRepository userProblemHistoryRepository) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.userProblemHistoryRepository = userProblemHistoryRepository;
    }

    @Transactional(readOnly = true)
    public List<HistoryItemDto> getUserHistory(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return userProblemHistoryRepository.findByUserIdOrderByRecordedAtDesc(user.getId())
                .stream()
                .map(HistoryItemDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoryItemDto addManualProblem(String email, HistoryImportItem item) {
        if (item.getTitle() == null || item.getTitle().isBlank()) {
            throw new BadRequestException("Problem title is required");
        }

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        String title = item.getTitle().trim();
        Optional<Problem> problemOpt = problemRepository.findByTitleIgnoreCase(title);

        Problem problem;
        if (problemOpt.isPresent()) {
            problem = problemOpt.get();
        } else {
            int pseudoId = 10000 + Math.abs(title.hashCode() % 90000);
            String diff = item.getDifficulty() != null ? item.getDifficulty() : "Easy";
            String topic = item.getTopic() != null ? item.getTopic() : "General";
            problem = new Problem(pseudoId, title, diff, topic, "https://leetcode.com/problemset/all/", "User added problem");
            problem = problemRepository.save(problem);
        }

        String status = item.getStatus() != null ? item.getStatus().toUpperCase() : "SOLVED";

        Optional<UserProblemHistory> existingHistory = userProblemHistoryRepository.findByUserAndProblem(user, problem);
        UserProblemHistory history;
        if (existingHistory.isPresent()) {
            history = existingHistory.get();
            history.setStatus(status);
        } else {
            history = new UserProblemHistory(user, problem, status);
        }

        return HistoryItemDto.fromEntity(userProblemHistoryRepository.save(history));
    }

    @Transactional
    public int importBatchHistory(String email, List<HistoryImportItem> items) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        int importedCount = 0;
        for (HistoryImportItem item : items) {
            if (item.getTitle() == null || item.getTitle().isBlank()) continue;
            addManualProblem(user.getEmail(), item);
            importedCount++;
        }
        return importedCount;
    }
}
