package com.leetcodedaily.dto;

public class DifficultyStatsDto {
    private int easySolved = 0;
    private int mediumSolved = 0;
    private int hardSolved = 0;
    private int totalSolved = 0;

    public DifficultyStatsDto() {}

    public DifficultyStatsDto(int easySolved, int mediumSolved, int hardSolved) {
        this.easySolved = easySolved;
        this.mediumSolved = mediumSolved;
        this.hardSolved = hardSolved;
        this.totalSolved = easySolved + mediumSolved + hardSolved;
    }

    public int getEasySolved() { return easySolved; }
    public void setEasySolved(int easySolved) { this.easySolved = easySolved; }

    public int getMediumSolved() { return mediumSolved; }
    public void setMediumSolved(int mediumSolved) { this.mediumSolved = mediumSolved; }

    public int getHardSolved() { return hardSolved; }
    public void setHardSolved(int hardSolved) { this.hardSolved = hardSolved; }

    public int getTotalSolved() { return totalSolved; }
    public void setTotalSolved(int totalSolved) { this.totalSolved = totalSolved; }
}
