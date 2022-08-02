package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.domain.Branch;
import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.domain.ServiceType;
import com.rade.dentistbookingsystem.model.AppointmentDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AppointmentComponent {
    private AppointmentDTO appointmentDTO;
    private ArrayList<ServiceDiscountComponent> serviceDiscountComponentList;
    private List<ServiceType> serviceTypeList;
    private Branch branch;
    private List<Doctor> doctorByBranchList;
}
