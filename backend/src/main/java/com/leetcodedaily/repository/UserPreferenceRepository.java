package com.leetcodedaily.repository;

import com.leetcodedaily.entity.User;
import com.leetcodedaily.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    Optional<UserPreference> findByUser(User user);
    Optional<UserPreference> findByUserId(Long userId);

    @Query("SELECT up FROM UserPreference up JOIN FETCH up.user WHERE up.emailNotificationsEnabled = true")
    List<UserPreference> findByEmailNotificationsEnabledTrue();
}
