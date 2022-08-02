package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AccountRepo extends JpaRepository<Account, Integer> {
    @Query(value = "SELECT Account.* FROM Account  WHERE phone = ?1", nativeQuery = true)
    Account findByPhone(String phone);

    @Query(value = "SELECT Account.* FROM Account  WHERE id = ?1", nativeQuery = true)
    Account findId(int id);

    @Modifying
    @Transactional
    @Query(value =
            "UPDATE Account SET status = :status " +
                    "WHERE id = :id",
            nativeQuery = true)
    void checkAccount(@Param("status") Integer status, @Param("id") Integer id);

    @Query(
            value = "SELECT a from Account a where a.role.id = ?1 and a.status =?2 AND " +
                    "(a.phone LIKE ?3 OR ?3 IS NULL OR ?3 = '') ORDER BY a.id DESC")
    List<Account> filterAccount(int roleId, short status, String phone);
}

