package com.kuizu.backend.controller;

import com.kuizu.backend.dto.response.FlashcardSetStatisticResponse;
import com.kuizu.backend.dto.response.UserStatisticResponse;
import com.kuizu.backend.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticController {

    private final StatisticService statisticService;

    @GetMapping("/users")
    public ResponseEntity<Page<UserStatisticResponse>> getUserStatistics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(statisticService.getUserStatistics(page, size));
    }

    @GetMapping("/flashcards")
    public ResponseEntity<Page<FlashcardSetStatisticResponse>> getFlashcardSetStatistics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(statisticService.getFlashcardSetStatistics(page, size));
    }
}
