package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.model.DoctorDTO;

import java.util.List;
import java.util.Optional;

public interface DoctorService {
    List<Doctor> findByBranchIdAndStatus(int branchId, int status);

    Doctor findId(Integer id);

    int countByBranchId(int branchId);

    Optional<Doctor> findById(Integer integer);

    // Use for admin
    List<Doctor> findAll();

    List<Doctor> findAllWithSort(String field);

    List<Doctor> filterDoctor(int status, String name, int branchId);

    Doctor addDoctor(DoctorDTO doctorDTO);

    Doctor editDoctor(DoctorDTO doctorDTO) throws Exception;

    Doctor deleteDoctor(int id);
}
