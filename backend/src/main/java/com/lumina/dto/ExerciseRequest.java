package com.lumina.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExerciseRequest {

    @NotBlank(message = "Exercise name is required")
    private String exerciseName;

    private String muscleGroup;

    private List<ExerciseSetDto> sets;
}
