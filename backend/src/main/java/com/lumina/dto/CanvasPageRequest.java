package com.lumina.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CanvasPageRequest {

    private String title;
    private String icon;
    private String content;
    private Boolean isPinned;
}
