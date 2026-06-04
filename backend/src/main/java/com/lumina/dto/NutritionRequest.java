package com.lumina.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NutritionRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Meal name is required")
    private String mealName;

    @Min(value = 0, message = "Calories cannot be negative")
    private Integer calories = 0;

    private BigDecimal protein = BigDecimal.ZERO;
    private BigDecimal carbs = BigDecimal.ZERO;
    private BigDecimal fats = BigDecimal.ZERO;
}
