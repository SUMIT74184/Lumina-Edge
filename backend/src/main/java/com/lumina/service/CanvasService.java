package com.lumina.service;

import com.lumina.dto.*;
import com.lumina.entity.CanvasPage;
import com.lumina.repository.CanvasPageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CanvasService {

    private static final int FREE_TIER_MAX_PAGES = 2;
    private static final int PREMIUM_TIER_MAX_PAGES = 40;

    private final CanvasPageRepository repository;

    @Transactional
    public CanvasPageResponse createPage(String userId, CanvasPageRequest request, boolean isPremium) {
        int maxPages = isPremium ? PREMIUM_TIER_MAX_PAGES : FREE_TIER_MAX_PAGES;
        long currentCount = repository.countByUserId(userId);

        if (currentCount >= maxPages) {
            throw new IllegalStateException(
                    String.format("Canvas page limit reached (%d/%d). %s",
                            currentCount, maxPages,
                            isPremium ? "Maximum pages reached." : "Upgrade to Premium for up to 40 pages."));
        }

        CanvasPage page = CanvasPage.builder()
                .userId(userId)
                .title(request.getTitle() != null ? request.getTitle() : "Untitled")
                .icon(request.getIcon() != null ? request.getIcon() : "📝")
                .content(request.getContent() != null ? request.getContent() : "{}")
                .isPinned(request.getIsPinned() != null && request.getIsPinned())
                .build();

        CanvasPage saved = repository.save(page);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CanvasPageResponse> getPages(String userId) {
        return repository.findAllByUserIdOrderByIsPinnedDescUpdatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CanvasPageResponse getPage(String userId, UUID pageId) {
        CanvasPage page = repository.findByIdAndUserId(pageId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Canvas page not found or unauthorized"));
        return toResponse(page);
    }

    @Transactional
    public CanvasPageResponse updatePage(String userId, UUID pageId, CanvasPageRequest request) {
        CanvasPage page = repository.findByIdAndUserId(pageId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Canvas page not found or unauthorized"));

        if (request.getTitle() != null) {
            page.setTitle(request.getTitle());
        }
        if (request.getIcon() != null) {
            page.setIcon(request.getIcon());
        }
        if (request.getContent() != null) {
            page.setContent(request.getContent());
        }
        if (request.getIsPinned() != null) {
            page.setPinned(request.getIsPinned());
        }

        return toResponse(repository.save(page));
    }

    @Transactional
    public void deletePage(String userId, UUID pageId) {
        CanvasPage page = repository.findByIdAndUserId(pageId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Canvas page not found or unauthorized"));
        repository.delete(page);
    }

    @Transactional(readOnly = true)
    public CanvasQuotaResponse getQuota(String userId, boolean isPremium) {
        long currentCount = repository.countByUserId(userId);
        int maxAllowed = isPremium ? PREMIUM_TIER_MAX_PAGES : FREE_TIER_MAX_PAGES;

        return CanvasQuotaResponse.builder()
                .currentCount(currentCount)
                .maxAllowed(maxAllowed)
                .canCreate(currentCount < maxAllowed)
                .build();
    }

    private CanvasPageResponse toResponse(CanvasPage page) {
        return CanvasPageResponse.builder()
                .id(page.getId())
                .title(page.getTitle())
                .icon(page.getIcon())
                .content(page.getContent())
                .isPinned(page.isPinned())
                .createdAt(page.getCreatedAt())
                .updatedAt(page.getUpdatedAt())
                .build();
    }
}
