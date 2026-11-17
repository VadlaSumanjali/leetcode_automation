package com.leetcodedaily.service;

import com.leetcodedaily.dto.*;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.exception.BadRequestException;
import com.leetcodedaily.exception.ResourceNotFoundException;
import com.leetcodedaily.repository.UserRepository;
import com.leetcodedaily.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final OtpService otpService;
    private final EmailNotificationService emailNotificationService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       OtpService otpService,
                       EmailNotificationService emailNotificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.otpService = otpService;
        this.emailNotificationService = emailNotificationService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());

        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

            String token = tokenProvider.generateToken(user.getId(), user.getEmail());
            return new AuthResponse(token, UserDto.fromEntity(user));
        } catch (BadCredentialsException ex) {
            throw new BadRequestException("Invalid email or password.");
        }
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return UserDto.fromEntity(user);
    }

    /**
     * Initiates password reset by generating a secure 6-digit OTP and emailing it to the user.
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        String otp = otpService.generateAndStoreOtp(email);
        boolean sent = emailNotificationService.sendOtpEmail(user, otp);
        if (!sent) {
            log.warn("Notice: OTP email dispatch returned false for {}", email);
        }
    }

    /**
     * Verifies the 6-digit OTP code for the given email address.
     */
    public void verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        boolean valid = otpService.verifyOtp(email, request.getOtp());
        if (!valid) {
            throw new BadRequestException("Invalid or expired 6-digit verification code. Please check and try again.");
        }
    }

    /**
     * Completes password reset once OTP has been verified.
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        boolean valid = otpService.verifyOtp(email, request.getOtp());
        if (!valid) {
            throw new BadRequestException("Invalid or expired verification code.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpService.clearOtp(email);
        emailNotificationService.sendPasswordResetSuccessEmail(user);
        log.info("Password successfully updated for user {}", email);
    }
}
