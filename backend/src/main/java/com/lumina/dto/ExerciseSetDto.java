package com.lumina.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExerciseSetDto {
    private Double weight;
    private Integer reps;
}
