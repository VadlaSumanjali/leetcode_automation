package com.leetcodedaily;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LeetCodeDailyApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeetCodeDailyApplication.class, args);
    }
}
