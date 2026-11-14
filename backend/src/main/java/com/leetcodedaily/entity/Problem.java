package com.leetcodedaily.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problems", indexes = {
    @Index(name = "idx_problems_topic", columnList = "topic"),
    @Index(name = "idx_problems_diff", columnList = "difficulty")
})
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer leetcodeId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 20)
    private String difficulty; // Easy, Medium, Hard

    @Column(nullable = false, length = 60)
    private String topic;

    @Column(nullable = false, length = 255)
    private String url;

    @Column(columnDefinition = "TEXT")
    private String summary;

    public Problem() {}

    public Problem(Integer leetcodeId, String title, String difficulty, String topic, String url, String summary) {
        this.leetcodeId = leetcodeId;
        this.title = title;
        this.difficulty = difficulty;
        this.topic = topic;
        this.url = url;
        this.summary = summary;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
}
