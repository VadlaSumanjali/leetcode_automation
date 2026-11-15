package com.leetcodedaily.dto;

import com.leetcodedaily.entity.DailyPlan;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class DailyPlanDto {
    private Long id;
    private LocalDate planDate;
    private int dayNumber;
    private int targetCount;
    private int completionPercentage;
    private List<DailyPlanProblemDto> problems = new ArrayList<>();

    public DailyPlanDto() {}

    public static DailyPlanDto fromEntity(DailyPlan plan) {
        DailyPlanDto dto = new DailyPlanDto();
        dto.setId(plan.getId());
        dto.setPlanDate(plan.getPlanDate());
        dto.setDayNumber(plan.getDayNumber());
        dto.setTargetCount(plan.getTargetCount());
        dto.setCompletionPercentage(plan.getCompletionPercentage());
        if (plan.getProblems() != null) {
            dto.setProblems(plan.getProblems().stream()
                    .map(DailyPlanProblemDto::fromEntity)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getPlanDate() { return planDate; }
    public void setPlanDate(LocalDate planDate) { this.planDate = planDate; }

    public int getDayNumber() { return dayNumber; }
    public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }

    public int getTargetCount() { return targetCount; }
    public void setTargetCount(int targetCount) { this.targetCount = targetCount; }

    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }

    public List<DailyPlanProblemDto> getProblems() { return problems; }
    public void setProblems(List<DailyPlanProblemDto> problems) { this.problems = problems; }
}
