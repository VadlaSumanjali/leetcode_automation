package com.leetcodedaily;

import com.leetcodedaily.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtTokenProviderTest {

    @Test
    void rejectsMissingSecret() {
        assertThrows(IllegalStateException.class, () -> new JwtTokenProvider("", 24));
    }

    @Test
    void rejectsWeakSecret() {
        assertThrows(IllegalStateException.class, () -> new JwtTokenProvider("too-short", 24));
    }

    @Test
    void acceptsStrongSecret() {
        JwtTokenProvider provider = assertDoesNotThrow(() -> new JwtTokenProvider(
                "a-strong-test-secret-that-is-at-least-32-bytes", 24));
        String token = provider.generateToken(1L, "user@example.com");

        assertTrue(provider.validateToken(token));
        assertEquals("user@example.com", provider.getEmailFromToken(token));
    }
}
