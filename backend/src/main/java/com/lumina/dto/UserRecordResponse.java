package com.lumina.dto;

import lombok.*;

@Data
@Builder
public class UserRecordResponse {
    private String id;
    private String userId;
    private String email;
    private String status;
    private String joinedAt;
}
