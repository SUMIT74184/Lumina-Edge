package com.lumina.dto;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventResponse {
    private UUID id;
    private String title;
    private String description;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private Boolean isAllDay;
    private String status;
}
