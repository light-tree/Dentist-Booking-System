package com.rade.dentistbookingsystem.controller;

import com.rade.dentistbookingsystem.domain.Province;
import com.rade.dentistbookingsystem.services.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/province")
public class ProvinceController {
    @Autowired
    ProvinceService provinceService;

    @GetMapping("")
    public List<Province> getProvinceList() {
        return provinceService.findAll();
    }
}
