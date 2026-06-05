package com.lumina.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActivityEventRequest {
    private String eventType;
    private String page;
}
