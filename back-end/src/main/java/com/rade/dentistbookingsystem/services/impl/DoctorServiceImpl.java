package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Branch;
import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.model.DoctorDTO;
import com.rade.dentistbookingsystem.repository.DoctorRepo;
import com.rade.dentistbookingsystem.services.BranchService;
import com.rade.dentistbookingsystem.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {
    DoctorRepo doctorRepo;
    @Autowired
    BranchService branchService;

    public DoctorServiceImpl(DoctorRepo doctorRepo) {
        this.doctorRepo = doctorRepo;
    }

    @Override
    public List<Doctor> findByBranchIdAndStatus(int branchId, int status) {
        return doctorRepo.findByBranchIdAndStatus(branchId, status);
    }

    public Doctor findId(Integer id) {
        return doctorRepo.findId(id);
    }

    @Override
    public int countByBranchId(int branchId) {
        return doctorRepo.countByBranchId(branchId);
    }

    @Override
    public Optional<Doctor> findById(Integer integer) {
        return doctorRepo.findById(integer);
    }

    // Use for admin
    @Override
    public List<Doctor> findAll() {
        return doctorRepo.findAll();
    }


    @Override
    public List<Doctor> findAllWithSort(String field) {
        return doctorRepo.findAll(Sort.by(Sort.Direction.DESC, field));
    }


    @Override
    public List<Doctor> filterDoctor(int status, String name, int branchId) {
        return doctorRepo.filterDoctor(status, name, branchId);
    }

    public <S extends Doctor> S save(S entity) {
        return doctorRepo.save(entity);
    }

    // nhận vào id tìm trong cơ sở dữ liêu, không tìm thấy sẽ tiến hành thêm mới

    @Override
    public Doctor addDoctor(DoctorDTO doctorDTO) {

        Doctor doctor = new Doctor();
        doctor.setName(doctorDTO.getName());
        doctor.setDescription(doctorDTO.getDescription());
        doctor.setUrl(doctorDTO.getUrl());
        Branch branch = branchService.findById(doctorDTO.getBranchId()).orElseThrow(() -> new RuntimeException("Can not find branch"));
        doctor.setBranch(branch);
        doctor.setStatus(1);
        return save(doctor);

    }

    @Override
    public Doctor editDoctor(DoctorDTO doctorDTO) throws Exception {
        Optional<Doctor> doctorData = findById(doctorDTO.getId());
        if (doctorData.isPresent()) {
            Doctor doctor = doctorData.get();
            doctor.setName(doctorDTO.getName());
            doctor.setDescription(doctorDTO.getDescription());
            doctor.setUrl(doctorDTO.getUrl());
            Branch branch = branchService.findById(doctorDTO.getBranchId()).orElseThrow(() -> new RuntimeException("Can not find branch"));
            doctor.setBranch(branch);
            doctor.setStatus(doctorDTO.getStatus());
            return save(doctor);
        }
        return null;

    }

    @Override
    public Doctor deleteDoctor(int id) {
        Optional<Doctor> doctorData = findById(id);
        if (doctorData.isPresent()) {
            Doctor doctor = doctorData.get();
            doctor.setStatus(Constant.DOCTOR_STATUS_INACTIVE);
            return save(doctor);

        } else throw new RuntimeException("Doctor do not exist");
    }

}
