package com.lumina.dto;

import lombok.*;

@Data
@Builder
public class ActivityHourlyResponse {
    private int hour;
    private long count;
}
