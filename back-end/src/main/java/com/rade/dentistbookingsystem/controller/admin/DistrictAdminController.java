package com.rade.dentistbookingsystem.controller.admin;

import com.rade.dentistbookingsystem.domain.District;
import com.rade.dentistbookingsystem.services.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("rade/admin/district")
public class DistrictAdminController {
    @Autowired
    DistrictService districtService;

    @GetMapping("list")
    public List<District> getListDistrict() {
        return districtService.findAll();
    }
}
