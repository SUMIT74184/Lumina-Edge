package com.lumina.controller;

import com.lumina.dto.*;
import com.lumina.service.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @PostMapping("/transactions")
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = financeService.createTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<TransactionResponse> transactions = financeService.getTransactions(startDate, endDate, page, size);
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = financeService.updateTransaction(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable java.util.UUID id) {
        financeService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<FinanceSummaryResponse> getSummary(@RequestParam String month) {
        FinanceSummaryResponse summary = financeService.getSummary(month);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/summary/yearly")
    public ResponseEntity<java.util.List<FinanceSummaryResponse>> getYearlySummary() {
        return ResponseEntity.ok(financeService.getYearlySummary());
    }
}
