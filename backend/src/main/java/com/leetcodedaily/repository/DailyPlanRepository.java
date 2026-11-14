package com.leetcodedaily.repository;

import com.leetcodedaily.entity.DailyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyPlanRepository extends JpaRepository<DailyPlan, Long> {
    Optional<DailyPlan> findByUserIdAndPlanDate(Long userId, LocalDate planDate);
    Optional<DailyPlan> findTopByUserIdOrderByPlanDateDesc(Long userId);
    List<DailyPlan> findByUserIdOrderByPlanDateDesc(Long userId);
}
