package com.rade.dentistbookingsystem.controller.patient;

import com.rade.dentistbookingsystem.domain.AppointmentDetail;
import com.rade.dentistbookingsystem.services.AppointmentDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/patient/appointment-detail")
public class AppointmentDetailPatientController {
    @Autowired
    AppointmentDetailService appointmentDetailService;

    @GetMapping("history/{id}")
    public List<AppointmentDetail> viewHistoryById(@PathVariable int id) {
        return appointmentDetailService.findByAppointmentId(id);
    }
}
