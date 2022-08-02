package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Integer> {
    @Query(value =
            "SELECT Notification.* " +
                    "FROM Notification " +
                    "WHERE (account_id = :account_id OR account_id is NULL)", nativeQuery = true)
    List<Notification> findByAccountId(@Param("account_id") Integer accountId, Pageable pageable);

    @Query(value =
            "SELECT TOP 1 Notification.* " +
                    "FROM Notification " +
                    "WHERE (account_id = :account_id OR account_id is NULL) AND " +
                    "date = CAST(:date  AS DATE) AND " +
                    "description = :description", nativeQuery = true)
    Notification findDuplicateDescriptionByAccountId(@Param("account_id") Integer accountId,
                                                     @Param("description") String description,
                                                     @Param("date") String date);
}
