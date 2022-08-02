package com.rade.dentistbookingsystem.controller.staff;

import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.services.ServiceSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/staff/service")
public class ServiceStaffController {
    @Autowired
    ServiceSv serviceSv;

    @GetMapping("list")
    public List<Service> loadServiceComponent() {
        return serviceSv.findAll();
    }
}
