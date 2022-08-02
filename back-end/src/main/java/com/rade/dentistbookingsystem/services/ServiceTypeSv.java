package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.domain.ServiceType;
import com.rade.dentistbookingsystem.model.ServiceTypeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ServiceTypeSv {

    long count();

    void deleteById(Integer id);

    List<ServiceType> findAll();

    ServiceType findByName(String name);

    Page<ServiceType> findAll(Pageable pageable);

    ServiceType findId(Integer id);

    ServiceType getById(Integer id);

    <S extends ServiceType> S save(S entity);

    ServiceType insert(ServiceTypeDTO serviceTypeDTO);

    boolean existsById(Integer integer);

    Optional<ServiceType> findById(Integer integer);

    ServiceType edit(ServiceTypeDTO serviceTypeDT);

    List<ServiceType> findAllHavingService();
}
