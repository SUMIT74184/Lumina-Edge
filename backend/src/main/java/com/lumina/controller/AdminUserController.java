package com.lumina.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private String id;
        private String email;
        private String status;
        private String joined;
    }

    private static final List<UserDto> users = new ArrayList<>();

    static {
        users.add(new UserDto(UUID.randomUUID().toString().substring(0, 8), "alex@example.com", "ACTIVE", "2024-01-15"));
        users.add(new UserDto(UUID.randomUUID().toString().substring(0, 8), "sarah@example.com", "ACTIVE", "2024-03-22"));
        users.add(new UserDto(UUID.randomUUID().toString().substring(0, 8), "mike@example.com", "SUSPENDED", "2024-05-10"));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<Void> suspendUser(@PathVariable String id) {
        users.stream().filter(u -> u.getId().equals(id)).findFirst().ifPresent(u -> u.setStatus("SUSPENDED"));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/enable")
    public ResponseEntity<Void> enableUser(@PathVariable String id) {
        users.stream().filter(u -> u.getId().equals(id)).findFirst().ifPresent(u -> u.setStatus("ACTIVE"));
        return ResponseEntity.ok().build();
    }
}
