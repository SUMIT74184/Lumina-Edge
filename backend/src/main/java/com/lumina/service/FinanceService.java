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
    public TransactionResponse createTransaction(TransactionRequest request) {
        FinanceTransaction entity = FinanceTransaction.builder()
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
    public Page<TransactionResponse> getTransactions(LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));

        Page<FinanceTransaction> transactions;
        if (startDate != null && endDate != null) {
            transactions = repository.findByTransactionDateBetween(startDate, endDate, pageable);
        } else {
            transactions = repository.findAll(pageable);
        }

        return transactions.map(this::toResponse);
    }

    @Transactional
    public TransactionResponse updateTransaction(UUID id, TransactionRequest request) {
        FinanceTransaction entity = repository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Transaction not found"));
        
        entity.setAmount(request.getAmount());
        entity.setTransactionType(TransactionType.valueOf(request.getType().toUpperCase()));
        entity.setCategory(request.getCategory());
        entity.setTransactionDate(request.getDate());
        entity.setNotes(request.getNotes());
        
        return toResponse(repository.save(entity));
    }

    @Transactional
    public void deleteTransaction(UUID id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public FinanceSummaryResponse getSummary(String month) {
        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalIncome = repository.sumIncomeByDateRange(startDate, endDate);
        BigDecimal totalExpense = repository.sumExpenseByDateRange(startDate, endDate);
        BigDecimal netSavings = totalIncome.subtract(totalExpense);

        return FinanceSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netSavings(netSavings)
                .month(month)
                .build();
    }

    @Transactional(readOnly = true)
    public java.util.List<FinanceSummaryResponse> getYearlySummary() {
        java.util.List<FinanceSummaryResponse> yearlyData = new java.util.ArrayList<>();
        YearMonth currentMonth = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            yearlyData.add(getSummary(targetMonth.toString()));
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
