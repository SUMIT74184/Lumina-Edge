package com.lumina.controller;

import com.lumina.dto.ActivityEventRequest;
import com.lumina.dto.ActivityHourlyResponse;
import com.lumina.service.UserActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
@RequiredArgsConstructor
public class UserActivityController {

    private final UserActivityService activityService;

    @PostMapping("/batch")
    public ResponseEntity<Void> logBatch(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody List<ActivityEventRequest> events) {
        activityService.logBatch(userId, events);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/hourly")
    public ResponseEntity<List<ActivityHourlyResponse>> getHourlyActivity(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ActivityHourlyResponse> data = activityService.getHourlyActivity(userId, date);
        return ResponseEntity.ok(data);
    }
}
