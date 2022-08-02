package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentComponentForFilter {
    private Integer[] status;
    private String date;
    private String phone;
    private Integer branchId;
    private Integer doctorId;
    private Integer serviceId;
}
