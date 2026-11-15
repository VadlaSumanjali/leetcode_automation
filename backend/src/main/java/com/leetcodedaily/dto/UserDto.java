package com.leetcodedaily.dto;

import com.leetcodedaily.entity.User;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean onboardingCompleted;

    public UserDto() {}

    public UserDto(Long id, String name, String email, String role, boolean onboardingCompleted) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.onboardingCompleted = onboardingCompleted;
    }

    public static UserDto fromEntity(User user) {
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.isOnboardingCompleted()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }
}
