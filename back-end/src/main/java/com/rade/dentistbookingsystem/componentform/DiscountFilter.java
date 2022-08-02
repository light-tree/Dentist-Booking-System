package com.rade.dentistbookingsystem.componentform;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiscountFilter {

    private int status;
    private String name;
    private String endDate;
    private int serviceId;

}
