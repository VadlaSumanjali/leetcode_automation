-- ==============================================================================
-- LeetCode Daily — Database Schema Definition (MySQL 8.0)
-- File: schema.sql
-- Direct import: mysql -u root -p leetcode_daily < schema.sql
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS leetcode_daily 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE leetcode_daily;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS app_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    experience_level VARCHAR(30) NOT NULL DEFAULT 'Beginner',
    daily_target INT NOT NULL DEFAULT 3,
    preferred_difficulty VARCHAR(30) NOT NULL DEFAULT 'Mixed',
    selected_topics VARCHAR(1000) NOT NULL DEFAULT 'Arrays,Strings,Hash Tables',
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    preferred_delivery_time TIME NOT NULL DEFAULT '06:00:00',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Problem Catalog Table
CREATE TABLE IF NOT EXISTS problems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    leetcode_id INT NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    topic VARCHAR(60) NOT NULL,
    url VARCHAR(255) NOT NULL,
    summary TEXT,
    INDEX idx_problems_topic (topic),
    INDEX idx_problems_diff (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Problem History (Duplicate Prevention Engine)
CREATE TABLE IF NOT EXISTS user_problem_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SOLVED',
    completed_at TIMESTAMP NULL,
    CONSTRAINT uk_user_problem UNIQUE (user_id, problem_id),
    CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_problem FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    INDEX idx_history_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Daily Plans Table
CREATE TABLE IF NOT EXISTS daily_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_date DATE NOT NULL,
    day_number INT NOT NULL DEFAULT 1,
    target_count INT NOT NULL DEFAULT 3,
    completion_percentage INT NOT NULL DEFAULT 0,
    email_delivered BOOLEAN NOT NULL DEFAULT FALSE,
    email_delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_date UNIQUE (user_id, plan_date),
    CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    INDEX idx_plan_user_date (user_id, plan_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Daily Plan Problems Table
CREATE TABLE IF NOT EXISTS daily_plan_problems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    daily_plan_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    is_carried_forward BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_plan_problem UNIQUE (daily_plan_id, problem_id),
    CONSTRAINT fk_dpp_plan FOREIGN KEY (daily_plan_id) REFERENCES daily_plans(id) ON DELETE CASCADE,
    CONSTRAINT fk_dpp_problem FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Email Delivery Logs Table (Idempotent Scheduler Tracking)
CREATE TABLE IF NOT EXISTS email_delivery_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_date DATE NOT NULL,
    recipient_email VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL,
    details VARCHAR(500),
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_log_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    INDEX idx_email_log_user_date (user_id, plan_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
