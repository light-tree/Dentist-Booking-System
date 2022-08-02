package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.domain.District;

import java.util.List;
import java.util.Optional;

public interface DistrictService {
    District getById(Integer integer);

    List<District> findAll();

    List<District> findByProvinceId(Integer id);

    Optional<District> findById(Integer integer);
}
