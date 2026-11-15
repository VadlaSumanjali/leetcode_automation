package com.leetcodedaily.dto;

import com.leetcodedaily.entity.UserProblemHistory;

import java.time.LocalDateTime;

public class HistoryItemDto {
    private Long id;
    private Long problemId;
    private Integer leetcodeId;
    private String title;
    private String difficulty;
    private String topic;
    private String status;
    private String url;
    private LocalDateTime recordedAt;

    public HistoryItemDto() {}

    public static HistoryItemDto fromEntity(UserProblemHistory uph) {
        HistoryItemDto dto = new HistoryItemDto();
        dto.setId(uph.getId());
        dto.setProblemId(uph.getProblem().getId());
        dto.setLeetcodeId(uph.getProblem().getLeetcodeId());
        dto.setTitle(uph.getProblem().getTitle());
        dto.setDifficulty(uph.getProblem().getDifficulty());
        dto.setTopic(uph.getProblem().getTopic());
        dto.setUrl(uph.getProblem().getUrl());
        dto.setStatus(uph.getStatus());
        dto.setRecordedAt(uph.getRecordedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }

    public Integer getLeetcodeId() { return leetcodeId; }
    public void setLeetcodeId(Integer leetcodeId) { this.leetcodeId = leetcodeId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
