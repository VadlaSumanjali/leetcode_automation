package com.leetcodedaily.dto;

import com.leetcodedaily.entity.DailyPlanProblem;
import com.leetcodedaily.entity.Problem;

public class DailyPlanProblemDto {
    private Long id;
    private Long problemId;
    private Integer leetcodeId;
    private String title;
    private String difficulty;
    private String topic;
    private String url;
    private String summary;
    private String status;
    private boolean carriedForward;

    public DailyPlanProblemDto() {}

    public static DailyPlanProblemDto fromEntity(DailyPlanProblem dpp) {
        Problem p = dpp.getProblem();
        DailyPlanProblemDto dto = new DailyPlanProblemDto();
        dto.setId(dpp.getId());
        dto.setProblemId(p.getId());
        dto.setLeetcodeId(p.getLeetcodeId());
        dto.setTitle(p.getTitle());
        dto.setDifficulty(p.getDifficulty());
        dto.setTopic(p.getTopic());
        dto.setUrl(p.getUrl());
        dto.setSummary(p.getSummary());
        dto.setStatus(dpp.getStatus());
        dto.setCarriedForward(dpp.isCarriedForward());
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

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isCarriedForward() { return carriedForward; }
    public void setCarriedForward(boolean carriedForward) { this.carriedForward = carriedForward; }
}
