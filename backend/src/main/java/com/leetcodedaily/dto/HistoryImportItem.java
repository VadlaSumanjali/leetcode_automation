package com.leetcodedaily.dto;

public class HistoryImportItem {
    private String title;
    private String difficulty;
    private String topic;
    private String status; // SOLVED, ATTEMPTED, SKIPPED

    public HistoryImportItem() {}

    public HistoryImportItem(String title, String difficulty, String topic, String status) {
        this.title = title;
        this.difficulty = difficulty;
        this.topic = topic;
        this.status = status;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
