package com.lumina.controller;

import com.lumina.dto.EventRequest;
import com.lumina.dto.EventResponse;
import com.lumina.service.TimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/time")
@RequiredArgsConstructor
public class TimeController {

    private final TimeService timeService;

    @PostMapping("/events")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponse response = timeService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<EventResponse> events = timeService.getEvents(startDate, endDate);
        return ResponseEntity.ok(events);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody EventRequest request) {
        EventResponse response = timeService.updateEvent(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable java.util.UUID id) {
        timeService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
