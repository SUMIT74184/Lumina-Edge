package com.lumina.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutRequest {

    @NotBlank(message = "Workout name is required")
    private String name;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private Integer durationMinutes;
}
