package com.rade.dentistbookingsystem.controller;

import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.services.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("rade/discount")
public class DiscountController {
    @Autowired
    DiscountService discountService;

    @GetMapping("{serviceId}")
    public Discount getDiscountByServiceId(@PathVariable int serviceId) {
        return discountService.findAvailableByServiceId(serviceId);
    }
}
