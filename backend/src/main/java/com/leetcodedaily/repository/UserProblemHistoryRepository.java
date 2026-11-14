package com.leetcodedaily.repository;

import com.leetcodedaily.entity.Problem;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.entity.UserProblemHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserProblemHistoryRepository extends JpaRepository<UserProblemHistory, Long> {

    boolean existsByUserAndProblem(User user, Problem problem);

    @Query("SELECT uph.problem.id FROM UserProblemHistory uph WHERE uph.user.id = :userId")
    Set<Long> findProblemIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT uph.problem.leetcodeId FROM UserProblemHistory uph WHERE uph.user.id = :userId")
    Set<Integer> findLeetcodeIdsByUserId(@Param("userId") Long userId);

    Optional<UserProblemHistory> findByUserAndProblem(User user, Problem problem);

    List<UserProblemHistory> findByUserIdOrderByRecordedAtDesc(Long userId);

    Page<UserProblemHistory> findByUserIdOrderByRecordedAtDesc(Long userId, Pageable pageable);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, String status);

    @Query("SELECT uph.problem.topic, COUNT(uph) FROM UserProblemHistory uph WHERE uph.user.id = :userId AND uph.status = 'SOLVED' GROUP BY uph.problem.topic")
    List<Object[]> countSolvedByTopicForUser(@Param("userId") Long userId);

    @Query("SELECT uph.problem.difficulty, COUNT(uph) FROM UserProblemHistory uph WHERE uph.user.id = :userId AND uph.status = 'SOLVED' GROUP BY uph.problem.difficulty")
    List<Object[]> countSolvedByDifficultyForUser(@Param("userId") Long userId);
}
