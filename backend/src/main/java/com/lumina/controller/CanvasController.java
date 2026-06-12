package com.lumina.controller;

import com.lumina.dto.*;
import com.lumina.service.CanvasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/canvas")
@RequiredArgsConstructor
public class CanvasController {

    private final CanvasService canvasService;

    @PostMapping("/pages")
    public ResponseEntity<CanvasPageResponse> createPage(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Plan", defaultValue = "free") String userPlan,
            @RequestBody CanvasPageRequest request) {
        boolean isPremium = "premium".equalsIgnoreCase(userPlan);
        CanvasPageResponse response = canvasService.createPage(userId, request, isPremium);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/pages")
    public ResponseEntity<List<CanvasPageResponse>> getPages(
            @RequestHeader("X-User-Id") String userId) {
        List<CanvasPageResponse> pages = canvasService.getPages(userId);
        return ResponseEntity.ok(pages);
    }

    @GetMapping("/pages/{id}")
    public ResponseEntity<CanvasPageResponse> getPage(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id) {
        CanvasPageResponse page = canvasService.getPage(userId, id);
        return ResponseEntity.ok(page);
    }

    @PutMapping("/pages/{id}")
    public ResponseEntity<CanvasPageResponse> updatePage(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id,
            @RequestBody CanvasPageRequest request) {
        CanvasPageResponse response = canvasService.updatePage(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/pages/{id}")
    public ResponseEntity<Void> deletePage(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID id) {
        canvasService.deletePage(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quota")
    public ResponseEntity<CanvasQuotaResponse> getQuota(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Plan", defaultValue = "free") String userPlan) {
        boolean isPremium = "premium".equalsIgnoreCase(userPlan);
        CanvasQuotaResponse quota = canvasService.getQuota(userId, isPremium);
        return ResponseEntity.ok(quota);
    }
}
