package com.lumina.service;

import com.lumina.dto.ActivityEventRequest;
import com.lumina.dto.ActivityHourlyResponse;
import com.lumina.entity.UserActivity;
import com.lumina.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserActivityRepository repository;

    @Transactional
    public void logBatch(String userId, List<ActivityEventRequest> events) {
        List<UserActivity> entities = events.stream()
                .map(event -> UserActivity.builder()
                        .userId(userId)
                        .eventType(event.getEventType())
                        .page(event.getPage())
                        .createdAt(OffsetDateTime.now())
                        .build())
                .collect(Collectors.toList());
        repository.saveAll(entities);
    }

    @Transactional(readOnly = true)
    public List<ActivityHourlyResponse> getHourlyActivity(String userId, LocalDate date) {
        OffsetDateTime startOfDay = date.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime endOfDay = date.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

        List<Object[]> results = repository.countByHour(userId, startOfDay, endOfDay);

        // Create a map from the results
        Map<Integer, Long> hourMap = results.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> ((Number) row[1]).longValue()
                ));

        // Fill all 24 hours
        List<ActivityHourlyResponse> hourlyData = new ArrayList<>();
        for (int h = 0; h < 24; h++) {
            hourlyData.add(ActivityHourlyResponse.builder()
                    .hour(h)
                    .count(hourMap.getOrDefault(h, 0L))
                    .build());
        }
        return hourlyData;
    }
}
