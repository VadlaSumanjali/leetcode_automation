package com.leetcodedaily.dto;

public class TopicProgressDto {
    private String topic;
    private int solved;
    private int total;
    private int percent;

    public TopicProgressDto() {}

    public TopicProgressDto(String topic, int solved, int total) {
        this.topic = topic;
        this.solved = solved;
        this.total = total;
        this.percent = total > 0 ? (int) Math.round(((double) solved / total) * 100) : 0;
    }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public int getSolved() { return solved; }
    public void setSolved(int solved) { this.solved = solved; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public int getPercent() { return percent; }
    public void setPercent(int percent) { this.percent = percent; }
}
