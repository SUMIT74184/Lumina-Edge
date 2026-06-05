package com.lumina.repository;

import com.lumina.entity.HealthWorkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthWorkoutRepository extends JpaRepository<HealthWorkout, UUID> {
    List<HealthWorkout> findByUserIdAndWorkoutDateOrderByCreatedAtDesc(String userId, LocalDate workoutDate);
    List<HealthWorkout> findAllByUserIdOrderByWorkoutDateDesc(String userId);
}
