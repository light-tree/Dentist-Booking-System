package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.domain.District;
import com.rade.dentistbookingsystem.repository.DistrictRepo;
import com.rade.dentistbookingsystem.services.DistrictService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DistrictServiceImpl implements DistrictService {
    private DistrictRepo districtRepo;

    public DistrictServiceImpl(DistrictRepo districtRepo) {
        this.districtRepo = districtRepo;
    }

    public District getById(Integer integer) {
        return districtRepo.getById(integer);
    }

    public List<District> findAll() {
        return districtRepo.findAll();
    }

    @Override
    public List<District> findByProvinceId(Integer id) {
        return districtRepo.findByProvinceId(id);
    }

    @Override
    public Optional<District> findById(Integer integer) {
        return districtRepo.findById(integer);
    }
}
