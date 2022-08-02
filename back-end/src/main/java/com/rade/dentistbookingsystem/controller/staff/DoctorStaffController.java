package com.rade.dentistbookingsystem.controller.staff;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/staff/doctor")
public class DoctorStaffController {
    @Autowired
    DoctorService doctorService;

    @GetMapping("{branchId}")
    public List<Doctor> getByBrandId(@PathVariable int branchId) {
        return doctorService.findByBranchIdAndStatus(branchId, Constant.DOCTOR_STATUS_ACTIVE);
    }
}
