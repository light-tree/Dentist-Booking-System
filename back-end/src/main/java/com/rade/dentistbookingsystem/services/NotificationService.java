package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.componentform.PhoneAndPage;
import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.domain.Feedback;
import com.rade.dentistbookingsystem.domain.Notification;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    <S extends Notification> S save(S entity);

    Notification newDiscount(Discount discount);

    List<Notification> findByAccountId(Integer accountId, Pageable pageable);

    List<Notification> findByAccountId(PhoneAndPage phoneAndPage);

    Notification findDuplicateDescriptionByAccountId(Integer accountId, String description);

    Notification findDuplicateDescription(Notification notification);

    void createRemindNotificationIfNeeded(String phone);

    void createNotificationForAbsent(Appointment appointment);

    void createNotificationForBannedByAbsent(Integer accountId);

    void createNotificationForBannedByFeedback(Integer accountId);

    void createNotificationForSendingFeedback(Feedback feedback);

    void createNotificationForCancellingAppointment(Appointment appointment);

    void createNotificationForUpdatingAppointment(Appointment appointment);

    void createNotificationForCancellingAppointmentFromAdmin(Appointment appointment, String description);

    void createNotificationForApprovingFeedbackFromAdmin(Feedback feedback);

    void createNotificationForDisapprovingFeedbackFromAdmin(Feedback feedback);

    void createNotificationFromAdmin(String description);
}
