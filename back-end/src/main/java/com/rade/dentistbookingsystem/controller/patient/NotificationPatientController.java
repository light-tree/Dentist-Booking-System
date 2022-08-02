package com.rade.dentistbookingsystem.controller.patient;

import com.rade.dentistbookingsystem.componentform.PhoneAndPage;
import com.rade.dentistbookingsystem.domain.Notification;
import com.rade.dentistbookingsystem.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/patient/notification")
public class NotificationPatientController {
    @Autowired
    NotificationService notificationService;

    @PostMapping("")
    public List<Notification> getPageNotification(@RequestBody PhoneAndPage phoneAndPage) {
        notificationService.createRemindNotificationIfNeeded(phoneAndPage.getPhone());
        return notificationService.findByAccountId(phoneAndPage);
    }
}
