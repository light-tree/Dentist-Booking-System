package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.domain.AppointmentDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentWithDetails {
    private Appointment appointment;
    private List<AppointmentDetail> appointmentDetailList;
}
