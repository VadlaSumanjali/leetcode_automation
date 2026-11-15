package com.leetcodedaily.service;

import com.leetcodedaily.entity.DailyPlan;
import com.leetcodedaily.entity.User;
import com.leetcodedaily.entity.UserPreference;
import com.leetcodedaily.repository.EmailDeliveryLogRepository;
import com.leetcodedaily.repository.UserPreferenceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class EmailSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(EmailSchedulerService.class);

    private final UserPreferenceRepository userPreferenceRepository;
    private final EmailDeliveryLogRepository emailDeliveryLogRepository;
    private final DailyPlanService dailyPlanService;
    private final EmailNotificationService emailNotificationService;

    public EmailSchedulerService(
            UserPreferenceRepository userPreferenceRepository,
            EmailDeliveryLogRepository emailDeliveryLogRepository,
            DailyPlanService dailyPlanService,
            EmailNotificationService emailNotificationService) {
        this.userPreferenceRepository = userPreferenceRepository;
        this.emailDeliveryLogRepository = emailDeliveryLogRepository;
        this.dailyPlanService = dailyPlanService;
        this.emailNotificationService = emailNotificationService;
    }

    // Runs every minute to check if any user's scheduled time has arrived in their local timezone
    @Scheduled(cron = "0 * * * * *")
    public void processScheduledEmailDispatches() {
        List<UserPreference> activePreferences = userPreferenceRepository.findByEmailNotificationsEnabledTrue();
        if (activePreferences.isEmpty()) {
            return;
        }

        log.info("EmailScheduler tick: evaluating {} active notification preferences", activePreferences.size());

        for (UserPreference pref : activePreferences) {
            User user = pref.getUser();
            if (user == null || !user.isOnboardingCompleted()) {
                continue;
            }

            ZoneId zoneId;
            try {
                zoneId = ZoneId.of(pref.getTimezone());
            } catch (Exception e) {
                zoneId = ZoneId.of("Asia/Kolkata");
            }

            ZonedDateTime nowInUserZone = ZonedDateTime.now(zoneId);
            LocalDate userLocalDate = nowInUserZone.toLocalDate();
            LocalTime userLocalTime = nowInUserZone.toLocalTime();
            LocalTime preferredTime = pref.getPreferredDeliveryTime();

            log.info("Evaluating user {}: now={}:{}, preferred={}:{}",
                    user.getEmail(), userLocalTime.getHour(), userLocalTime.getMinute(),
                    preferredTime.getHour(), preferredTime.getMinute());

            // Match hour and minute
            if (userLocalTime.getHour() == preferredTime.getHour() &&
                userLocalTime.getMinute() == preferredTime.getMinute()) {

                // Check Idempotency: verify email hasn't already been delivered for this date
                boolean alreadySent = emailDeliveryLogRepository
                        .existsByUserIdAndPlanDateAndStatus(user.getId(), userLocalDate, "SUCCESS");

                if (alreadySent) {
                    continue;
                }

                log.info("Triggering scheduled daily email dispatch for user {} at local time {}",
                        user.getEmail(), userLocalTime);

                DailyPlan todayPlan = dailyPlanService.getOrCreateTodayPlan(user);
                emailNotificationService.sendDailyPlanEmail(user, todayPlan);
            }
        }
    }
}
