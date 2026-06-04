package com.lumina.repository;

import com.lumina.entity.FinanceTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface FinanceTransactionRepository extends JpaRepository<FinanceTransaction, UUID> {

    Page<FinanceTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query("SELECT COALESCE(SUM(ft.amount), 0) FROM FinanceTransaction ft " +
           "WHERE ft.transactionType = 'INCOME' AND ft.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumIncomeByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(ft.amount), 0) FROM FinanceTransaction ft " +
           "WHERE ft.transactionType = 'EXPENSE' AND ft.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
