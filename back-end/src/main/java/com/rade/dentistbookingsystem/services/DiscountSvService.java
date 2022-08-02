package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.domain.DiscountService;
import com.rade.dentistbookingsystem.model.DiscountServiceDTO;

import java.util.List;

public interface DiscountSvService {
    List<DiscountService> findByDiscountId(int id);


    DiscountService addServiceDiscount(DiscountServiceDTO discountServiceDTO);

    void deleteAllByDiscount_Id(int id);

    DiscountService editServiceDiscount(DiscountServiceDTO discountServiceDTO);


}
