package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.domain.Feedback;
import com.rade.dentistbookingsystem.model.FeedbackDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeedbackService {
    abstract Feedback save(FeedbackDTO feedbackDTO);

    Page<Feedback> findAll(Pageable pageable);

    List<Feedback> findAllWithSort();

    //
    Feedback check(Integer status, Integer id);
//
//    List<Feedback> findByServiceIdAndStatus(int id, int status, Pageable pageable);

    List<Feedback> filterFeedback(String phone, Integer status, Integer serviceId, String time, Pageable pageable);

    List<Feedback> filterFeedbackForAdmin(String phone, Integer status, Integer serviceId, String time);

    boolean checkAccountToBanByFeedback(int accountId);

    Feedback updateFeedbackStatus(int feedbackId, int feedbackStatus);

    Feedback updateFeedbackStatusByAdmin(int feedbackId, int feedbackStatus);

//    int countByAccountIdAndStatus(int account_id, int status);
}
