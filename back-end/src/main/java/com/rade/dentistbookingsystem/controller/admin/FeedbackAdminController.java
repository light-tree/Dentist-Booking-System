package com.rade.dentistbookingsystem.controller.admin;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.PageForFeedback;
import com.rade.dentistbookingsystem.domain.Feedback;
import com.rade.dentistbookingsystem.services.AccountService;
import com.rade.dentistbookingsystem.services.FeedbackService;
import com.rade.dentistbookingsystem.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/admin/feedback")
public class FeedbackAdminController {
    @Autowired
    FeedbackService feedbackService;
    @Autowired
    NotificationService notificationService;
    @Autowired
    AccountService accountService;

    @PostMapping("list")
    public List<Feedback> getListFeedback() {
        return feedbackService.findAllWithSort();
    }

    @PostMapping("filter")
    public List<Feedback> filterFeedbackForAdmin(@RequestBody PageForFeedback pageForFeedback) {
        return feedbackService.filterFeedbackForAdmin(pageForFeedback.getPhone(),
                pageForFeedback.getStatus(),
                pageForFeedback.getServiceId(),
                pageForFeedback.getTime());
    }
    @PostMapping("approve/{id}")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> approveFeedback(@PathVariable int id) {
        Feedback feedback = feedbackService.updateFeedbackStatusByAdmin(id, Constant.FEEDBACK_STATUS_APPROVE);
        notificationService.createNotificationForApprovingFeedbackFromAdmin(feedback);
        return ResponseEntity.ok().build();


    }

    @PostMapping("disapprove/{id}")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> disapproveFeedback(@PathVariable int id) {
        Feedback feedback = feedbackService.updateFeedbackStatusByAdmin(id, Constant.FEEDBACK_STATUS_DISAPPROVE);
        notificationService.createNotificationForDisapprovingFeedbackFromAdmin(feedback);
        int accountId = feedback.getAppointment().getAccount().getId();
        if (feedbackService.checkAccountToBanByFeedback(accountId)) {
            accountService.checkAccount(Constant.ACCOUNT_STATUS_INACTIVE, accountId);
        }
        return ResponseEntity.ok().build();
    }
}
