package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Feedback;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepo extends JpaRepository<Feedback, Integer> {
    @Query(value =
            "SELECT Feedback.* \n" +
                    "FROM Feedback, Appointment ap, Account ac, Appointment_Detail ad \n" +
                    "WHERE Feedback.appointment_id = ap.id AND ap.id = ad.appointment_id AND ac.id = ap.account_id AND \n" +
                    "((ac.phone LIKE CONCAT('%',:phone,'%') OR :phone IS NULL OR :phone = '') AND \n" +
                    "(Feedback.status = :status OR :status IS NULL) AND \n" +
                    "(ad.service_id = :service_id OR :service_id = 0) AND \n" +
                    "(DATEDIFF(day, Feedback.time, :time) = 0 OR :time IS NULL)) " +
                    "GROUP BY Feedback.id, Feedback.content, Feedback.appointment_id, Feedback.status, Feedback.time",
            nativeQuery = true)
    List<Feedback> filterFeedback(@Param("phone") String phone,
                                  @Param("status") Integer status,
                                  @Param("service_id") Integer serviceId,
                                  @Param("time") String time,
                                  Pageable pageable);

    @Query(value =
            "SELECT Feedback.* \n" +
                    "FROM Feedback, Appointment ap, Account ac, Appointment_Detail ad \n" +
                    "WHERE Feedback.appointment_id = ap.id AND ap.account_id = ac.id AND ap.id = ad.appointment_id AND \n" +
                    "(ac.phone LIKE CONCAT('%',:phone,'%') OR :phone IS NULL OR :phone = '') AND \n" +
                    "(Feedback.status = :status OR :status IS NULL) AND \n" +
                    "(ad.service_id = :service_id OR :service_id = 0) AND \n" +
                    "(DATEDIFF(day, Feedback.time, :time) = 0 OR :time IS NULL) " +
                    "GROUP BY Feedback.id, Feedback.content, Feedback.appointment_id, Feedback.status, Feedback.time",
            nativeQuery = true)
    List<Feedback> filterFeedbackForAdmin(@Param("phone") String phone,
                                          @Param("status") Integer status,
                                          @Param("service_id") Integer serviceId,
                                          @Param("time") String time);

    @Query(value =
            "SELECT " +
                    "CASE WHEN ( " +
                    "SELECT COUNT(Feedback.id) " +
                    "FROM Feedback LEFT JOIN Appointment a ON Feedback.appointment_id = a.id " +
                    "WHERE a.account_id = :account_id AND Feedback.status = "+ Constant.FEEDBACK_STATUS_DISAPPROVE +" " +
                    ") >= "+ Constant.VIOLATED_FEEDBACK_TIME_TO_BAN +" " +
                    "THEN 'TRUE' " +
                    "ELSE 'FALSE' " +
                    "END",
            nativeQuery = true)
    boolean checkAccountToBanByFeedback(@Param("account_id") int accountId);
}
