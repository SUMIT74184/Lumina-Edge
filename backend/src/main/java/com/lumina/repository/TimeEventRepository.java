package com.lumina.repository;

import com.lumina.entity.TimeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TimeEventRepository extends JpaRepository<TimeEvent, UUID> {

    List<TimeEvent> findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(String userId, OffsetDateTime startTime, OffsetDateTime endTime);
}
