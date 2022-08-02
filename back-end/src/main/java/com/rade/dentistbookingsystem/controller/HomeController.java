/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.rade.dentistbookingsystem.controller;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.BranchListInProvince;
import com.rade.dentistbookingsystem.componentform.HomeComponent;
import com.rade.dentistbookingsystem.componentform.ReportData;
import com.rade.dentistbookingsystem.domain.Province;
import com.rade.dentistbookingsystem.repository.AppointmentRepo;
import com.rade.dentistbookingsystem.services.AppointmentService;
import com.rade.dentistbookingsystem.services.BranchService;
import com.rade.dentistbookingsystem.services.ProvinceService;
import com.rade.dentistbookingsystem.services.ServiceTypeSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Masterkien
 */
@RestController
@CrossOrigin
@RequestMapping("rade/home")
public class HomeController {
    @Autowired
    BranchService branchService;
    @Autowired
    ServiceTypeSv serviceTypeSv;
    @Autowired
    ProvinceService provinceService;
    @Autowired
    AppointmentService appointmentService;
    @GetMapping("")
    public HomeComponent list(Model model) {
        return new HomeComponent(serviceTypeSv.findAllHavingService(), branchService.findAvailable());
    }

    @GetMapping("branch")
    public List<BranchListInProvince> showBranchListInProvince() {
        List<BranchListInProvince> branchListInProvinceList = new ArrayList<>();
        for (Province province : provinceService.findAll()) {
            BranchListInProvince branchListInProvince = new BranchListInProvince(
                    province,
                    branchService.findAvailablePriorityByProvinceId(province.getId())
            );
            if(branchListInProvince.getBranchList().size() > 0) branchListInProvinceList.add((branchListInProvince));
        }
        return branchListInProvinceList;
    }
}
