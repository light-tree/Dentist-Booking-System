package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.componentform.JsonAppointment;
import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.domain.AppointmentDetail;

import java.util.List;

public interface AppointmentDetailService {
    AppointmentDetail save(AppointmentDetail appointmentDetail);

    List<AppointmentDetail> save(Appointment appointment, JsonAppointment jsonAppointment);

    List<AppointmentDetail> findByAppointmentId(int appointmentId);
}
