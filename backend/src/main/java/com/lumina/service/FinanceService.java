package com.lumina.service;

import com.lumina.dto.*;
import com.lumina.entity.FinanceTransaction;
import com.lumina.entity.FinanceTransaction.TransactionType;
import com.lumina.repository.FinanceTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FinanceTransactionRepository repository;

    @Transactional
    public TransactionResponse createTransaction(String userId, TransactionRequest request) {
        FinanceTransaction entity = FinanceTransaction.builder()
                .userId(userId)
                .amount(request.getAmount())
                .transactionType(TransactionType.valueOf(request.getType().toUpperCase()))
                .category(request.getCategory())
                .transactionDate(request.getDate())
                .notes(request.getNotes())
                .build();

        FinanceTransaction saved = repository.save(entity);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactions(String userId, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));

        Page<FinanceTransaction> transactions;
        if (startDate != null && endDate != null) {
            transactions = repository.findByUserIdAndTransactionDateBetween(userId, startDate, endDate, pageable);
        } else {
            // Need a custom query if we don't have a specific date range, but here we'll just filter by user
            transactions = repository.findByUserIdAndTransactionDateBetween(userId, LocalDate.of(1900, 1, 1), LocalDate.of(2100, 1, 1), pageable);
        }

        return transactions.map(this::toResponse);
    }

    @Transactional
    public TransactionResponse updateTransaction(String userId, UUID id, TransactionRequest request) {
        FinanceTransaction entity = repository.findById(id)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Transaction not found or unauthorized"));
        
        entity.setAmount(request.getAmount());
        entity.setTransactionType(TransactionType.valueOf(request.getType().toUpperCase()));
        entity.setCategory(request.getCategory());
        entity.setTransactionDate(request.getDate());
        entity.setNotes(request.getNotes());
        
        return toResponse(repository.save(entity));
    }

    @Transactional
    public void deleteTransaction(String userId, UUID id) {
        FinanceTransaction entity = repository.findById(id)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Transaction not found or unauthorized"));
        repository.delete(entity);
    }

    @Transactional(readOnly = true)
    public FinanceSummaryResponse getSummary(String userId, String month) {
        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalIncome = repository.sumIncomeByDateRange(userId, startDate, endDate);
        BigDecimal totalExpense = repository.sumExpenseByDateRange(userId, startDate, endDate);
        BigDecimal netSavings = totalIncome.subtract(totalExpense);

        return FinanceSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netSavings(netSavings)
                .month(month)
                .build();
    }

    @Transactional(readOnly = true)
    public java.util.List<FinanceSummaryResponse> getYearlySummary(String userId) {
        java.util.List<FinanceSummaryResponse> yearlyData = new java.util.ArrayList<>();
        YearMonth currentMonth = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            yearlyData.add(getSummary(userId, targetMonth.toString()));
        }
        return yearlyData;
    }

    private TransactionResponse toResponse(FinanceTransaction entity) {
        return TransactionResponse.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .transaction_type(entity.getTransactionType().name())
                .category(entity.getCategory())
                .transaction_date(entity.getTransactionDate())
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
