package com.lumina.service;

import com.lumina.dto.EventRequest;
import com.lumina.dto.EventResponse;
import com.lumina.entity.TimeEvent;
import com.lumina.repository.TimeEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeService {

    private final TimeEventRepository repository;

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        TimeEvent entity = TimeEvent.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isAllDay(request.getIsAllDay() != null ? request.getIsAllDay() : false)
                .status(request.getStatus() != null ? request.getStatus() : "INCOMPLETE")
                .build();

        TimeEvent saved = repository.save(entity);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEvents(LocalDate startDate, LocalDate endDate) {
        OffsetDateTime start = startDate.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime end = endDate.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

        return repository.findByStartTimeBetweenOrderByStartTimeAsc(start, end)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse updateEvent(java.util.UUID id, EventRequest request) {
        TimeEvent entity = repository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Event not found"));
        
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setStartTime(request.getStartTime());
        entity.setEndTime(request.getEndTime());
        entity.setIsAllDay(request.getIsAllDay() != null ? request.getIsAllDay() : false);
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
        
        return toResponse(repository.save(entity));
    }

    @Transactional
    public void deleteEvent(java.util.UUID id) {
        repository.deleteById(id);
    }

    private EventResponse toResponse(TimeEvent entity) {
        return EventResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .isAllDay(entity.getIsAllDay())
                .status(entity.getStatus())
                .build();
    }
}
