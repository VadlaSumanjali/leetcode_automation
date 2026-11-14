package com.leetcodedaily;

import com.leetcodedaily.controller.HealthController;
import com.leetcodedaily.dto.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    @Test
    void testHealthCheckDirect() {
        HealthController controller = new HealthController();
        ReflectionTestUtils.setField(controller, "appName", "leetcode-daily-backend");
        ReflectionTestUtils.setField(controller, "activeProfile", "dev");

        ResponseEntity<ApiResponse<Map<String, Object>>> response = controller.checkHealth();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());

        Map<String, Object> data = response.getBody().getData();
        assertEquals("UP", data.get("status"));
        assertEquals("leetcode-daily-backend", data.get("application"));
        assertEquals("dev", data.get("environment"));
        assertNotNull(data.get("javaVersion"));
        assertNotNull(data.get("serverTime"));
    }
}
