package com.lumina.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionResponse {
    private UUID id;
    private BigDecimal amount;
    private String transaction_type;
    private String category;
    private LocalDate transaction_date;
    private String notes;
    private OffsetDateTime createdAt;
}
