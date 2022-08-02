package com.rade.dentistbookingsystem.controller;

import com.rade.dentistbookingsystem.domain.District;
import com.rade.dentistbookingsystem.services.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/district")
public class DistrictController {
    @Autowired
    DistrictService districtService;

    @GetMapping("{provinceId}")
    public List<District> getDistrictListByProvinceID(@PathVariable int provinceId) {
        return districtService.findByProvinceId(provinceId);
    }
}
