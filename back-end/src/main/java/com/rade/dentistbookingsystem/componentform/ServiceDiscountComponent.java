package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.domain.Service;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ServiceDiscountComponent {
    private Service service;
    private Discount discount;
}
