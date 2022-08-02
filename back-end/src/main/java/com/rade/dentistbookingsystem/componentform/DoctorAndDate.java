package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DoctorAndDate {
    private Integer appointmentId;
    private int branchId;
    private int doctorId;
    private String date;
    private int[] serviceId;
}
