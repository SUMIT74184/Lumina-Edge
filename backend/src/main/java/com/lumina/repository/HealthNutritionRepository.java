package com.lumina.repository;

import com.lumina.entity.HealthNutrition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import java.util.List;

@Repository
public interface HealthNutritionRepository extends JpaRepository<HealthNutrition, UUID> {
    List<HealthNutrition> findByUserIdAndLogDateOrderByCreatedAtDesc(String userId, LocalDate logDate);
    List<HealthNutrition> findAllByUserIdOrderByLogDateDesc(String userId);

    @Query("SELECT COALESCE(SUM(n.calories), 0) FROM HealthNutrition n WHERE n.userId = :userId AND n.logDate = :date")
    Integer sumCaloriesByDate(@Param("userId") String userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(n.protein), 0) FROM HealthNutrition n WHERE n.userId = :userId AND n.logDate = :date")
    BigDecimal sumProteinByDate(@Param("userId") String userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(n.carbs), 0) FROM HealthNutrition n WHERE n.userId = :userId AND n.logDate = :date")
    BigDecimal sumCarbsByDate(@Param("userId") String userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(n.fats), 0) FROM HealthNutrition n WHERE n.userId = :userId AND n.logDate = :date")
    BigDecimal sumFatsByDate(@Param("userId") String userId, @Param("date") LocalDate date);
}
