package com.leetcodedaily.repository;

import com.leetcodedaily.entity.EmailDeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmailDeliveryLogRepository extends JpaRepository<EmailDeliveryLog, Long> {
    boolean existsByUserIdAndPlanDateAndStatus(Long userId, LocalDate planDate, String status);
    List<EmailDeliveryLog> findByUserIdOrderBySentAtDesc(Long userId);
}
