package com.lumina.service;

import com.lumina.dto.AdminMetricsResponse;
import com.lumina.repository.FinanceTransactionRepository;
import com.lumina.repository.HealthWorkoutRepository;
import com.lumina.repository.TimeEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final FinanceTransactionRepository financeRepo;
    private final TimeEventRepository timeRepo;
    private final HealthWorkoutRepository workoutRepo;

    @Transactional(readOnly = true)
    public AdminMetricsResponse getMetrics() {
        long totalTx = financeRepo.count();
        long totalEvents = timeRepo.count();
        long totalWorkouts = workoutRepo.count();

        // Calculate a pseudo "ARR" or total value managed based on transactions
        // For a real app, this would query a Subscriptions table.
        BigDecimal arr = BigDecimal.valueOf(totalTx * 1200L); // e.g., mock value

        return AdminMetricsResponse.builder()
                .totalTransactions(totalTx)
                .totalEvents(totalEvents)
                .totalWorkouts(totalWorkouts)
                .globalARR(arr)
                .build();
    }
}
