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
    public ResponseEntity<WorkoutResponse> createWorkout(@Valid @RequestBody WorkoutRequest request) {
        WorkoutResponse response = healthService.createWorkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/workouts/{id}/exercises")
    public ResponseEntity<WorkoutResponse.ExerciseResponse> addExercise(
            @PathVariable UUID id,
            @Valid @RequestBody ExerciseRequest request) {
        WorkoutResponse.ExerciseResponse response = healthService.addExercise(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/workouts/{id}")
    public ResponseEntity<WorkoutResponse> getWorkout(@PathVariable UUID id) {
        WorkoutResponse response = healthService.getWorkout(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/workouts")
    public ResponseEntity<java.util.List<WorkoutResponse>> getWorkoutsByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(healthService.getWorkoutsByDate(date));
    }

    @PutMapping("/workouts/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @PathVariable UUID id,
            @Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(healthService.updateWorkout(id, request));
    }

    @DeleteMapping("/workouts/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable UUID id) {
        healthService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/nutrition")
    public ResponseEntity<HealthNutrition> logNutrition(@Valid @RequestBody NutritionRequest request) {
        HealthNutrition nutrition = healthService.logNutrition(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nutrition);
    }

    @GetMapping("/nutrition")
    public ResponseEntity<java.util.List<HealthNutrition>> getNutritionByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(healthService.getNutritionByDate(date));
    }

    @PutMapping("/nutrition/{id}")
    public ResponseEntity<HealthNutrition> updateNutrition(
            @PathVariable UUID id,
            @Valid @RequestBody NutritionRequest request) {
        return ResponseEntity.ok(healthService.updateNutrition(id, request));
    }

    @DeleteMapping("/nutrition/{id}")
    public ResponseEntity<Void> deleteNutrition(@PathVariable UUID id) {
        healthService.deleteNutrition(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nutrition/summary")
    public ResponseEntity<NutritionSummaryResponse> getNutritionSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        NutritionSummaryResponse summary = healthService.getNutritionSummary(date);
        return ResponseEntity.ok(summary);
    }
}
