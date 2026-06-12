package com.lumina.dto;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CanvasPageResponse {

    private UUID id;
    private String title;
    private String icon;
    private String content;
    private boolean isPinned;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
