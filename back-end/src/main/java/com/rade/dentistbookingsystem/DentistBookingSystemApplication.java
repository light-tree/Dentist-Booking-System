package com.rade.dentistbookingsystem;

import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.services.AccountService;
import com.rade.dentistbookingsystem.services.AppointmentService;
import com.rade.dentistbookingsystem.services.FeedbackService;
import com.rade.dentistbookingsystem.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

@SpringBootApplication
public class DentistBookingSystemApplication {
    @Autowired
    AppointmentService appointmentService;
    @Autowired
    AccountService accountService;
    @Autowired
    NotificationService notificationService;
    @Autowired
    FeedbackService feedbackService;
    public static void main(String[] args) {
        SpringApplication.run(DentistBookingSystemApplication.class, args);
    }

    @Scheduled(fixedDelayString = "PT1M")
    void checkAllAppointmentToMarkAbsent() throws InterruptedException{
        List<Appointment> appointmentList = appointmentService.findAllAppointmentToMarkAbsent();
        for (Appointment appointment : appointmentList) {
            Integer accountId = appointment.getAccount().getId();
            appointmentService.check(Constant.APPOINTMENT_STATUS_ABSENT, appointment.getId());
            notificationService.createNotificationForAbsent(appointment);
            if (appointmentService.checkAccountToBanByAppointment(accountId)) {
                accountService.checkAccount(Constant.ACCOUNT_STATUS_INACTIVE, accountId);
            }
        }
    }
}

@Configuration
@EnableScheduling
@ConditionalOnProperty(name = "scheduling.enabled", matchIfMissing = true)
class SchedulingOnConfiguration {

}
