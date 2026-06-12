package com.lumina.repository;

import com.lumina.entity.CanvasPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CanvasPageRepository extends JpaRepository<CanvasPage, UUID> {

    List<CanvasPage> findAllByUserIdOrderByIsPinnedDescUpdatedAtDesc(String userId);

    long countByUserId(String userId);

    Optional<CanvasPage> findByIdAndUserId(UUID id, String userId);
}
