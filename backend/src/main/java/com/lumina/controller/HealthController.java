package com.lumina.controller;

import com.lumina.dto.*;
import com.lumina.entity.HealthNutrition;
import com.lumina.service.HealthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    @PostMapping("/workouts")
    public ResponseEntity<WorkoutResponse> createWorkout(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody WorkoutRequest request) {
        WorkoutResponse response = healthService.createWorkout(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/workouts/{id}/exercises")
    public ResponseEntity<WorkoutResponse.ExerciseResponse> addExercise(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id,
            @Valid @RequestBody ExerciseRequest request) {
        WorkoutResponse.ExerciseResponse response = healthService.addExercise(userId, id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/workouts/{id}")
    public ResponseEntity<WorkoutResponse> getWorkout(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id) {
        WorkoutResponse response = healthService.getWorkout(userId, id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/workouts")
    public ResponseEntity<java.util.List<WorkoutResponse>> getWorkoutsByDate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(healthService.getWorkoutsByDate(userId, date));
    }

    @PutMapping("/workouts/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id,
            @Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(healthService.updateWorkout(userId, id, request));
    }

    @DeleteMapping("/workouts/{id}")
    public ResponseEntity<Void> deleteWorkout(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id) {
        healthService.deleteWorkout(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/nutrition")
    public ResponseEntity<HealthNutrition> logNutrition(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody NutritionRequest request) {
        HealthNutrition nutrition = healthService.logNutrition(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nutrition);
    }

    @GetMapping("/nutrition")
    public ResponseEntity<java.util.List<HealthNutrition>> getNutritionByDate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(healthService.getNutritionByDate(userId, date));
    }

    @PutMapping("/nutrition/{id}")
    public ResponseEntity<HealthNutrition> updateNutrition(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id,
            @Valid @RequestBody NutritionRequest request) {
        return ResponseEntity.ok(healthService.updateNutrition(userId, id, request));
    }

    @DeleteMapping("/nutrition/{id}")
    public ResponseEntity<Void> deleteNutrition(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id) {
        healthService.deleteNutrition(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nutrition/summary")
    public ResponseEntity<NutritionSummaryResponse> getNutritionSummary(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        NutritionSummaryResponse summary = healthService.getNutritionSummary(userId, date);
        return ResponseEntity.ok(summary);
    }
}
