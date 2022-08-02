package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReportData {
    private long total;
    private long done;
    private long cancelByCustomer;
    private long cancelByStaff;
    private long absent;
}
