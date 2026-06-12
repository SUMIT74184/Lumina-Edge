package com.lumina.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CanvasQuotaResponse {

    private long currentCount;
    private int maxAllowed;
    private boolean canCreate;
}
