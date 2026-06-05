package com.lumina.service;

import com.lumina.dto.*;
import com.lumina.entity.UserRecord;
import com.lumina.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final FinanceTransactionRepository financeRepo;
    private final TimeEventRepository timeRepo;
    private final HealthWorkoutRepository workoutRepo;
    private final HealthNutritionRepository nutritionRepo;
    private final UserActivityRepository activityRepo;
    private final UserRecordRepository userRecordRepo;

    @Transactional(readOnly = true)
    public AdminMetricsResponse getMetrics() {
        long totalTx = financeRepo.count();
        long totalEvents = timeRepo.count();
        long totalWorkouts = workoutRepo.count();
        long totalUsers = userRecordRepo.count();

        // Calculate a pseudo "ARR" based on user count
        BigDecimal arr = BigDecimal.valueOf(totalUsers * 2500L);

        return AdminMetricsResponse.builder()
                .totalTransactions(totalTx)
                .totalEvents(totalEvents)
                .totalWorkouts(totalWorkouts)
                .globalARR(arr)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getAnalytics() {
        return AdminAnalyticsResponse.builder()
                .totalUsers(userRecordRepo.count())
                .totalTransactions(financeRepo.count())
                .totalEvents(timeRepo.count())
                .totalWorkouts(workoutRepo.count())
                .totalNutritionLogs(nutritionRepo.count())
                .totalActivityEvents(activityRepo.count())
                .totalTransactionVolume(BigDecimal.ZERO) // Could sum all transactions
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserRecordResponse> getAllUsers() {
        return userRecordRepo.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserRecordResponse addMember(String email) {
        if (userRecordRepo.existsByEmail(email)) {
            throw new IllegalArgumentException("A user with this email already exists");
        }

        UserRecord record = UserRecord.builder()
                .userId("pending_" + UUID.randomUUID().toString().substring(0, 8))
                .email(email)
                .status("ACTIVE")
                .build();

        return toResponse(userRecordRepo.save(record));
    }

    @Transactional
    public UserRecordResponse suspendUser(UUID id) {
        UserRecord record = userRecordRepo.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found"));
        record.setStatus("SUSPENDED");
        return toResponse(userRecordRepo.save(record));
    }

    @Transactional
    public UserRecordResponse activateUser(UUID id) {
        UserRecord record = userRecordRepo.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found"));
        record.setStatus("ACTIVE");
        return toResponse(userRecordRepo.save(record));
    }

    /**
     * Auto-register a user when they first interact with the system.
     * Called from activity tracking to keep user_records in sync.
     */
    @Transactional
    public void ensureUserExists(String userId, String email) {
        if (!userRecordRepo.existsByUserId(userId)) {
            UserRecord record = UserRecord.builder()
                    .userId(userId)
                    .email(email != null ? email : userId + "@lumina.edge")
                    .status("ACTIVE")
                    .build();
            userRecordRepo.save(record);
        }
    }

    private UserRecordResponse toResponse(UserRecord record) {
        return UserRecordResponse.builder()
                .id(record.getId().toString())
                .userId(record.getUserId())
                .email(record.getEmail())
                .status(record.getStatus())
                .joinedAt(record.getCreatedAt() != null
                        ? record.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE)
                        : "Today")
                .build();
    }
}
