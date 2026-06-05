package com.lumina.service;

import com.lumina.dto.*;
import com.lumina.entity.HealthExercise;
import com.lumina.entity.HealthNutrition;
import com.lumina.entity.HealthWorkout;
import com.lumina.repository.HealthExerciseRepository;
import com.lumina.repository.HealthNutritionRepository;
import com.lumina.repository.HealthWorkoutRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthService {

    private final HealthWorkoutRepository workoutRepository;
    private final HealthExerciseRepository exerciseRepository;
    private final HealthNutritionRepository nutritionRepository;

    // ---- Workouts ----

    @Transactional
    public WorkoutResponse createWorkout(String userId, WorkoutRequest request) {
        HealthWorkout entity = HealthWorkout.builder()
                .userId(userId)
                .name(request.getName())
                .workoutDate(request.getDate())
                .durationMinutes(request.getDurationMinutes())
                .build();

        HealthWorkout saved = workoutRepository.save(entity);
        return toWorkoutResponse(saved);
    }

    @Transactional(readOnly = true)
    public WorkoutResponse getWorkout(String userId, UUID id) {
        HealthWorkout workout = workoutRepository.findById(id)
                .filter(w -> w.getUserId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Workout not found with id: " + id));
        return toWorkoutResponse(workout);
    }

    @Transactional(readOnly = true)
    public List<WorkoutResponse> getWorkoutsByDate(String userId, LocalDate date) {
        if (date == null) {
            return workoutRepository.findAllByUserIdOrderByWorkoutDateDesc(userId)
                    .stream()
                    .map(this::toWorkoutResponse)
                    .collect(Collectors.toList());
        }
        return workoutRepository.findByUserIdAndWorkoutDateOrderByCreatedAtDesc(userId, date)
                .stream()
                .map(this::toWorkoutResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkoutResponse updateWorkout(String userId, UUID id, WorkoutRequest request) {
        HealthWorkout workout = workoutRepository.findById(id)
                .filter(w -> w.getUserId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Workout not found with id: " + id));
        
        workout.setName(request.getName());
        workout.setWorkoutDate(request.getDate());
        workout.setDurationMinutes(request.getDurationMinutes());
        
        return toWorkoutResponse(workoutRepository.save(workout));
    }

    @Transactional
    public void deleteWorkout(String userId, UUID id) {
        HealthWorkout workout = workoutRepository.findById(id)
                .filter(w -> w.getUserId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Workout not found with id: " + id));
        workoutRepository.delete(workout);
    }

    @Transactional
    public WorkoutResponse.ExerciseResponse addExercise(String userId, UUID workoutId, ExerciseRequest request) {
        HealthWorkout workout = workoutRepository.findById(workoutId)
                .filter(w -> w.getUserId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Workout not found with id: " + workoutId));

        List<HealthExercise.ExerciseSet> sets = request.getSets() != null
                ? request.getSets().stream()
                    .map(s -> new HealthExercise.ExerciseSet(s.getWeight(), s.getReps()))
                    .collect(Collectors.toList())
                : List.of();

        HealthExercise exercise = HealthExercise.builder()
                .userId(userId)
                .workout(workout)
                .exerciseName(request.getExerciseName())
                .targetMuscleGroup(request.getMuscleGroup())
                .sets(sets)
                .build();

        HealthExercise saved = exerciseRepository.save(exercise);

        return WorkoutResponse.ExerciseResponse.builder()
                .id(saved.getId())
                .exerciseName(saved.getExerciseName())
                .targetMuscleGroup(saved.getTargetMuscleGroup())
                .sets(saved.getSets().stream()
                        .map(s -> new ExerciseSetDto(s.getWeight(), s.getReps()))
                        .collect(Collectors.toList()))
                .build();
    }

    // ---- Nutrition ----

    @Transactional
    public HealthNutrition logNutrition(String userId, NutritionRequest request) {
        HealthNutrition entity = HealthNutrition.builder()
                .userId(userId)
                .logDate(request.getDate())
                .mealName(request.getMealName())
                .calories(request.getCalories())
                .protein(request.getProtein())
                .carbs(request.getCarbs())
                .fats(request.getFats())
                .build();

        return nutritionRepository.save(entity);
    }

    @Transactional(readOnly = true)
    public List<HealthNutrition> getNutritionByDate(String userId, LocalDate date) {
        if (date == null) {
            return nutritionRepository.findAllByUserIdOrderByLogDateDesc(userId);
        }
        return nutritionRepository.findByUserIdAndLogDateOrderByCreatedAtDesc(userId, date);
    }

    @Transactional
    public HealthNutrition updateNutrition(String userId, UUID id, NutritionRequest request) {
        HealthNutrition entity = nutritionRepository.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Nutrition log not found with id: " + id));
        
        entity.setLogDate(request.getDate());
        entity.setMealName(request.getMealName());
        entity.setCalories(request.getCalories());
        entity.setProtein(request.getProtein());
        entity.setCarbs(request.getCarbs());
        entity.setFats(request.getFats());
        
        return nutritionRepository.save(entity);
    }

    @Transactional
    public void deleteNutrition(String userId, UUID id) {
        HealthNutrition entity = nutritionRepository.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Nutrition log not found with id: " + id));
        nutritionRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public NutritionSummaryResponse getNutritionSummary(String userId, LocalDate date) {
        return NutritionSummaryResponse.builder()
                .totalCalories(nutritionRepository.sumCaloriesByDate(userId, date))
                .totalProtein(nutritionRepository.sumProteinByDate(userId, date))
                .totalCarbs(nutritionRepository.sumCarbsByDate(userId, date))
                .totalFats(nutritionRepository.sumFatsByDate(userId, date))
                .date(date.toString())
                .build();
    }

    // ---- Mappers ----

    private WorkoutResponse toWorkoutResponse(HealthWorkout entity) {
        List<WorkoutResponse.ExerciseResponse> exercises = entity.getExercises() != null
                ? entity.getExercises().stream().map(ex -> WorkoutResponse.ExerciseResponse.builder()
                    .id(ex.getId())
                    .exerciseName(ex.getExerciseName())
                    .targetMuscleGroup(ex.getTargetMuscleGroup())
                    .sets(ex.getSets().stream()
                            .map(s -> new ExerciseSetDto(s.getWeight(), s.getReps()))
                            .collect(Collectors.toList()))
                    .build())
                .collect(Collectors.toList())
                : List.of();

        return WorkoutResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .workoutDate(entity.getWorkoutDate())
                .durationMinutes(entity.getDurationMinutes())
                .createdAt(entity.getCreatedAt())
                .exercises(exercises)
                .build();
    }
}
