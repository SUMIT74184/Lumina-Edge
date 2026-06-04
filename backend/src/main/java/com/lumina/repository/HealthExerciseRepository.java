package com.lumina.repository;

import com.lumina.entity.HealthExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HealthExerciseRepository extends JpaRepository<HealthExercise, UUID> {
}
