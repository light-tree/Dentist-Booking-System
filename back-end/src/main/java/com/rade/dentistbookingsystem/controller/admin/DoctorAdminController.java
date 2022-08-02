package com.rade.dentistbookingsystem.controller.admin;


import com.rade.dentistbookingsystem.componentform.DoctorFilter;
import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.model.DoctorDTO;
import com.rade.dentistbookingsystem.services.BranchService;
import com.rade.dentistbookingsystem.services.DoctorService;
import com.rade.dentistbookingsystem.services.GoogleDriveFileService;
import com.rade.dentistbookingsystem.utils.image.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("rade/admin/doctor")
public class DoctorAdminController {

    @Autowired
    DoctorService doctorService;

    @Autowired
    BranchService branchService;

    @Autowired
    GoogleDriveFileService googleDriveFileService;

    @Autowired
    ImageService imageService;

    @GetMapping("{id}")
    public Optional<Doctor> findById(@PathVariable int id) {
        Optional<Doctor> doctor = doctorService.findById(id);
        if (doctor.isPresent()) {
            return doctor;  
        } else throw new NotFoundException("Doctor not found");
    }

    @GetMapping("list")
    public List<Doctor> viewDoctorList() {
        try {
            return doctorService.findAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("filter")
    public List<Doctor> filterDoctor(@RequestBody DoctorFilter doctorFilter) {
        return doctorService.filterDoctor(doctorFilter.getStatus(), doctorFilter.getName(), doctorFilter.getBranchId());
    }

    @GetMapping("list/sort/{field}")
    public List<Doctor> viewSortingListDoctor(@PathVariable String field) {
        return doctorService.findAllWithSort(field);
    }

    @PostMapping(value = "add-image")
    public ResponseEntity<?> addDoctorImg(@RequestParam MultipartFile url) throws Exception {
        String id = imageService.validateAndDownload(url);
        if (id != null)
            return ResponseEntity.ok(id); // lấy id gán vào cột url của serviceDTO sẽ gửi lên requeest
        else
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @PostMapping("add")
    public ResponseEntity<?> insertDoctor(@RequestBody @Validated DoctorDTO doctorDTO) throws Exception {

        Doctor doctor = doctorService.addDoctor(doctorDTO);
        if (doctor != null)
            return ResponseEntity.ok(doctor);
        else {
            imageService.removeImg(doctorDTO.getUrl());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }


    }

    @PostMapping("edit")
    public ResponseEntity<?> updateDoctor(@RequestBody @Validated DoctorDTO doctorDTO) throws Exception {
        Doctor doctor = doctorService.editDoctor(doctorDTO);
        if (doctor != null)
            return ResponseEntity.ok(doctor);
        else {
            imageService.removeImg(doctorDTO.getUrl());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }

    }
    
    @GetMapping("delete/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable int id) {
        try {
            Doctor doctor = doctorService.deleteDoctor(id);
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }


}
