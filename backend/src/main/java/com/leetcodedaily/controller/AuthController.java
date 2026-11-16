package com.leetcodedaily.controller;

import com.leetcodedaily.dto.ApiResponse;
import com.leetcodedaily.dto.AuthResponse;
import com.leetcodedaily.dto.LoginRequest;
import com.leetcodedaily.dto.RegisterRequest;
import com.leetcodedaily.dto.UserDto;
import com.leetcodedaily.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/auth", "/auth"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Account successfully created"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails,
            org.springframework.security.core.Authentication authentication) {
        String email = null;
        if (userDetails != null) {
            email = userDetails.getUsername();
        } else if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            email = authentication.getName();
        }

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Session expired or invalid"));
        }
        UserDto userDto = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.success(userDto, "User profile retrieved"));
    }
}
