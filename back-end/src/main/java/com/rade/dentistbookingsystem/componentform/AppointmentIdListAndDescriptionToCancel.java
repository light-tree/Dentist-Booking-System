package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentIdListAndDescriptionToCancel {
    private int[] appointmentIdList;
    private String description;
}
