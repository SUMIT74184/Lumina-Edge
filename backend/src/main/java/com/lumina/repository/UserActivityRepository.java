package com.lumina.repository;

import com.lumina.entity.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface UserActivityRepository extends JpaRepository<UserActivity, UUID> {

    @Query(value = "SELECT EXTRACT(HOUR FROM ua.created_at) as hour, COUNT(*) as count " +
                   "FROM user_activity ua " +
                   "WHERE ua.user_id = :userId " +
                   "AND ua.created_at >= :startDate " +
                   "AND ua.created_at < :endDate " +
                   "GROUP BY EXTRACT(HOUR FROM ua.created_at) " +
                   "ORDER BY hour", nativeQuery = true)
    List<Object[]> countByHour(
            @Param("userId") String userId,
            @Param("startDate") OffsetDateTime startDate,
            @Param("endDate") OffsetDateTime endDate);

    long countByUserId(String userId);
}
