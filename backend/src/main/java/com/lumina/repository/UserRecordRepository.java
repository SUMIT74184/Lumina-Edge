package com.lumina.repository;

import com.lumina.entity.UserRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRecordRepository extends JpaRepository<UserRecord, UUID> {

    Optional<UserRecord> findByUserId(String userId);

    Optional<UserRecord> findByEmail(String email);

    List<UserRecord> findAllByOrderByCreatedAtDesc();

    boolean existsByEmail(String email);

    boolean existsByUserId(String userId);
}
