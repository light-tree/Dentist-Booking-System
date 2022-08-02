package com.rade.dentistbookingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreOTP {
    private String phone;
    private String otp;
    private Date generatedDate;
}
