package com.lumina.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminMetricsResponse {
    private long totalTransactions;
    private long totalEvents;
    private long totalWorkouts;
    private java.math.BigDecimal globalARR;
}
