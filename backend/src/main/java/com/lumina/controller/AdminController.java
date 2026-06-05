package com.lumina.controller;

import com.lumina.dto.*;
import com.lumina.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsResponse> getMetrics() {
        return ResponseEntity.ok(adminService.getMetrics());
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserRecordResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserRecordResponse> addMember(
            @Valid @RequestBody AddMemberRequest request) {
        UserRecordResponse response = adminService.addMember(request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<UserRecordResponse> suspendUser(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.suspendUser(id));
    }

    @PutMapping("/users/{id}/enable")
    public ResponseEntity<UserRecordResponse> enableUser(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.activateUser(id));
    }
}
