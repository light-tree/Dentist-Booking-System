package com.rade.dentistbookingsystem.controller;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.ServiceDiscountComponent;
import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.services.ServiceSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/service")
public class ServiceController {
    @Autowired
    ServiceSv serviceSv;

    @GetMapping("{serviceTypeId}")
    public List<Service> getServiceByServiceTypeId(@PathVariable int serviceTypeId) {
        return serviceSv.findByServiceTypeIdAndStatus(serviceTypeId, (short)Constant.SERVICE_STATUS_ACTIVE);
    }

    @GetMapping("discount/{serviceTypeId}")
    public List<ServiceDiscountComponent> getServiceByServiceTypeIdIncludeDiscount(@PathVariable int serviceTypeId) {
        return serviceSv.findByServiceTypeIdAndStatusIncludeDiscount(serviceTypeId, (short)Constant.SERVICE_STATUS_ACTIVE);
    }

    @GetMapping("")
    public List<Service> getAllService() {
        return serviceSv.findAll();
    }
}
