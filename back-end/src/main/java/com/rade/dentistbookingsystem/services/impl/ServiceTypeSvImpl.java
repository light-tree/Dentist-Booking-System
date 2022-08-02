package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.domain.ServiceType;
import com.rade.dentistbookingsystem.exceptions.DuplicateRecordException;
import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.model.ServiceTypeDTO;
import com.rade.dentistbookingsystem.repository.ServiceTypeRepo;
import com.rade.dentistbookingsystem.services.ServiceTypeSv;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceTypeSvImpl implements ServiceTypeSv {
    ServiceTypeRepo serviceTypeRepo;

    public ServiceTypeSvImpl(ServiceTypeRepo serviceTypeRepo) {
        this.serviceTypeRepo = serviceTypeRepo;
    }

    public List<ServiceType> findAll() {
        return serviceTypeRepo.findAll();
    }

    @Override
    public ServiceType findByName(String name) {
        return serviceTypeRepo.findByName(name);
    }

    public Page<ServiceType> findAll(Pageable pageable) {
        return serviceTypeRepo.findAll(pageable);
    }

    public ServiceType getById(Integer id) {
        return serviceTypeRepo.getById(id);
    }

    public <S extends ServiceType> S save(S entity) {
        return serviceTypeRepo.save(entity);
    }

    public ServiceType findId(Integer id) {
        return serviceTypeRepo.findId(id);
    }

    public long count() {
        return serviceTypeRepo.count();
    }

    public void deleteById(Integer id) {
        serviceTypeRepo.deleteById(id);
    }

    @Override
    public ServiceType insert(ServiceTypeDTO serviceTypeDTO) {

        if (serviceTypeRepo.findByName(serviceTypeDTO.getName()) == null) {
            ServiceType serviceType = new ServiceType(serviceTypeDTO.getName(), serviceTypeDTO.getDescription());
            return save(serviceType);
        } else throw new DuplicateRecordException("Service type name has been use");


    }

    @Override
    public boolean existsById(Integer integer) {
        return serviceTypeRepo.existsById(integer);
    }

    @Override
    public Optional<ServiceType> findById(Integer integer) {
        return serviceTypeRepo.findById(integer);
    }

    @Override
    public ServiceType edit(ServiceTypeDTO serviceTypeDTO) {
        Optional<ServiceType> serviceTypeData = findById(serviceTypeDTO.getId());
        if (serviceTypeData.isPresent()) {

            ServiceType serviceType = serviceTypeData.get();
            if (findByName(serviceTypeDTO.getName()) != null && findByName(serviceTypeDTO.getName()).getId() != serviceTypeDTO.getId())
                throw new ValidationException("This service type has been use");
            serviceType.setName(serviceTypeDTO.getName());
            serviceType.setDescription(serviceTypeDTO.getDescription());

            return save(serviceType);
        } else throw new NotFoundException("Service type not found");


    }
    @Override
    public List<ServiceType> findAllHavingService() {
        return serviceTypeRepo.findAllHavingService();
    }
}
