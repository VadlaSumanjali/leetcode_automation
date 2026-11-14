package com.leetcodedaily.repository;

import com.leetcodedaily.entity.DailyPlanProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DailyPlanProblemRepository extends JpaRepository<DailyPlanProblem, Long> {
    List<DailyPlanProblem> findByDailyPlanId(Long dailyPlanId);
    Optional<DailyPlanProblem> findByDailyPlanIdAndProblemId(Long dailyPlanId, Long problemId);
}
