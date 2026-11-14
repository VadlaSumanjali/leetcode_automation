package com.leetcodedaily.repository;

import com.leetcodedaily.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    Optional<Problem> findByLeetcodeId(Integer leetcodeId);
    Optional<Problem> findByTitleIgnoreCase(String title);

    @Query("SELECT p FROM Problem p WHERE p.topic IN :topics")
    List<Problem> findByTopics(@Param("topics") List<String> topics);

    @Query("SELECT p FROM Problem p WHERE p.topic IN :topics AND p.difficulty = :difficulty")
    List<Problem> findByTopicsAndDifficulty(@Param("topics") List<String> topics, @Param("difficulty") String difficulty);
}
