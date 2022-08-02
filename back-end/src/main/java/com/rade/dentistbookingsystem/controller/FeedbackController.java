package com.rade.dentistbookingsystem.controller;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.PageForFeedback;
import com.rade.dentistbookingsystem.domain.Feedback;
import com.rade.dentistbookingsystem.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/feedback")
public class FeedbackController {
    @Autowired
    FeedbackService feedbackService;

    @PostMapping("")
    public List<Feedback> getFeedbackPage(@RequestBody PageForFeedback pageForFeedback) {
        int page = pageForFeedback.getPage() - 1;
        Integer serviceId = pageForFeedback.getServiceId();
        Pageable pageable = PageRequest.of(page, 3, Sort.by("id").descending());
        return feedbackService.filterFeedback(null, Constant.SERVICE_STATUS_ACTIVE, serviceId, null, pageable);
    }
}