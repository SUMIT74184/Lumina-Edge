package com.lumina.dto;

import lombok.*;

@Data
@Builder
public class AdminAnalyticsResponse {
    private long totalUsers;
    private long totalTransactions;
    private long totalEvents;
    private long totalWorkouts;
    private long totalNutritionLogs;
    private long totalActivityEvents;
    private java.math.BigDecimal totalTransactionVolume;
}
