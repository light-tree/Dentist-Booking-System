package com.rade.dentistbookingsystem.controller.patient;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/patient/doctor")
public class DoctorPatientController {
    @Autowired
    DoctorService doctorService;

    @GetMapping("{branchId}")
    public List<Doctor> getByBrandId(@PathVariable int branchId) {
        return doctorService.findByBranchIdAndStatus(branchId, Constant.BRANCH_STATUS_ACTIVE);
    }
}
