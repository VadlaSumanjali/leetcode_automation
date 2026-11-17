package com.leetcodedaily.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final int OTP_EXPIRATION_MINUTES = 15;
    private final SecureRandom random = new SecureRandom();

    // Map: lowercase email -> OtpRecord
    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    public static class OtpRecord {
        private final String otp;
        private final LocalDateTime expiresAt;
        private int attempts;
        private boolean verified;

        public OtpRecord(String otp, LocalDateTime expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
            this.attempts = 0;
            this.verified = false;
        }

        public String getOtp() { return otp; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public int getAttempts() { return attempts; }
        public void incrementAttempts() { this.attempts++; }
        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }
    }

    public String generateAndStoreOtp(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        int code = 100000 + random.nextInt(900000); // 6-digit number
        String otp = String.valueOf(code);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        otpStore.put(normalizedEmail, new OtpRecord(otp, expiresAt));
        log.info("Generated 6-digit OTP [{}] for email: {} (expires in {} mins)", otp, normalizedEmail, OTP_EXPIRATION_MINUTES);
        return otp;
    }

    public boolean verifyOtp(String email, String inputOtp) {
        String normalizedEmail = email.trim().toLowerCase();
        OtpRecord record = otpStore.get(normalizedEmail);

        if (record == null) {
            log.warn("OTP verification failed: no OTP requested for {}", normalizedEmail);
            return false;
        }

        if (LocalDateTime.now().isAfter(record.getExpiresAt())) {
            log.warn("OTP verification failed: OTP expired for {}", normalizedEmail);
            otpStore.remove(normalizedEmail);
            return false;
        }

        if (record.getAttempts() >= 5) {
            log.warn("OTP verification failed: max attempts exceeded for {}", normalizedEmail);
            otpStore.remove(normalizedEmail);
            return false;
        }

        record.incrementAttempts();

        boolean match = record.getOtp().equals(inputOtp != null ? inputOtp.trim() : "");
        if (match) {
            record.setVerified(true);
            log.info("OTP successfully verified for {}", normalizedEmail);
        } else {
            log.warn("OTP verification failed: incorrect OTP for {}", normalizedEmail);
        }
        return match;
    }

    public boolean isOtpVerified(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        OtpRecord record = otpStore.get(normalizedEmail);
        return record != null && record.isVerified() && LocalDateTime.now().isBefore(record.getExpiresAt());
    }

    public void clearOtp(String email) {
        otpStore.remove(email.trim().toLowerCase());
    }
}
