package com.lumina.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutResponse {
    private UUID id;
    private String name;
    private LocalDate workoutDate;
    private Integer durationMinutes;
    private OffsetDateTime createdAt;
    private List<ExerciseResponse> exercises;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ExerciseResponse {
        private UUID id;
        private String exerciseName;
        private String targetMuscleGroup;
        private List<ExerciseSetDto> sets;
    }
}
