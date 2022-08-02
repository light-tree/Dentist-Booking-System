package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.domain.Service;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AppointmentComponentForUpdate {
    private Appointment appointment;
    private List<Doctor> doctorList;
    private List<Service> serviceList;
}
