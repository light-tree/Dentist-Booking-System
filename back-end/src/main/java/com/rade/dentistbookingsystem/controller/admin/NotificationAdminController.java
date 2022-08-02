package com.rade.dentistbookingsystem.controller.admin;

import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.domain.Notification;
import com.rade.dentistbookingsystem.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("rade/admin/notification")
public class NotificationAdminController {
    @Autowired
    NotificationService notificationService;

    @PostMapping("new-discount")
    public Notification newDiscount(Discount discount) {
        return notificationService.newDiscount(discount);
    }
}
