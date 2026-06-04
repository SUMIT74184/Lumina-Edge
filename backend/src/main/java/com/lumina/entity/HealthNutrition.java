package com.lumina.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "health_nutrition")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HealthNutrition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "meal_name", nullable = false, length = 100)
    private String mealName;

    @Column(nullable = false)
    private Integer calories = 0;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal protein = BigDecimal.ZERO;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal carbs = BigDecimal.ZERO;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal fats = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
