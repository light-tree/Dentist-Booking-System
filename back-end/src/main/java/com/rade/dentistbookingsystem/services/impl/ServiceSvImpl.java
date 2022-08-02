package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.ServiceDiscountComponent;
import com.rade.dentistbookingsystem.componentform.ServiceFilter;
import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.domain.ServiceType;
import com.rade.dentistbookingsystem.exceptions.DuplicateRecordException;
import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.model.ServiceDTO;
import com.rade.dentistbookingsystem.repository.ServiceRepo;
import com.rade.dentistbookingsystem.services.DiscountService;
import com.rade.dentistbookingsystem.services.ServiceSv;
import com.rade.dentistbookingsystem.services.ServiceTypeSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceSvImpl implements ServiceSv {
    ServiceRepo serviceRepo;
    @Autowired
    ServiceTypeSv serviceTypeSv;

    @Autowired
    DiscountService discountService;

    public ServiceSvImpl(ServiceRepo serviceRepo) {
        this.serviceRepo = serviceRepo;
    }

    @Override
    public List<Service> findByServiceType(ServiceType serviceType) {
        return serviceRepo.findByServiceType(serviceType);
    }

    @Override
    public <S extends Service> S save(S entity) {
        return serviceRepo.save(entity);
    }

    @Override
    public Service insert(ServiceDTO serviceDTO) throws Exception {
        if (serviceRepo.findByName(serviceDTO.getName()) != null)
            throw new DuplicateRecordException("This service name has been use");

        Service service = new Service();
        service.setName(serviceDTO.getName());
        service.setStatus(serviceDTO.getStatus());
        service.setDescription(serviceDTO.getDescription());
        service.setMinPrice(serviceDTO.getMinPrice());
        service.setMaxPrice(serviceDTO.getMaxPrice());
        service.setUrl(serviceDTO.getUrl());
        service.setEstimatedTime(serviceDTO.getEstimatedTime());
        service.setServiceType(serviceTypeSv.findById(serviceDTO.getServiceTypeId()).orElseThrow(() -> new NotFoundException("Service type id not found")));
        return save(service);


    }

    public Service findId(Integer id) {
        return serviceRepo.findId(id);
    }

    public List<Service> findByServiceTypeId(int id) {
        return serviceRepo.findByServiceTypeId(id);
    }

    @Override
    public List<Service> findAll() {
        return serviceRepo.findAll();
    }

    @Override
    public Optional<Service> findById(Integer integer) {
        return serviceRepo.findById(integer);
    }

    @Override
    public Service edit(ServiceDTO serviceDTO) {
        Optional<Service> serviceData = findById(serviceDTO.getId());
        if (serviceData.isPresent()) {
            Service service = serviceData.get();
            if (serviceRepo.findByName(serviceDTO.getName()) != null && serviceRepo.findByName(serviceDTO.getName()).getId() != serviceDTO.getId())
                throw new ValidationException("This service name has been use");
            service.setName(serviceDTO.getName());
            service.setDescription(serviceDTO.getDescription());
            service.setStatus(serviceDTO.getStatus());
            service.setMinPrice(serviceDTO.getMinPrice());
            service.setMaxPrice(serviceDTO.getMaxPrice());
            service.setUrl(serviceDTO.getUrl());
            service.setServiceType(serviceTypeSv.findById(serviceDTO.getServiceTypeId()).orElseThrow(() -> new NotFoundException("Service type id not found")));
            service.setEstimatedTime(serviceDTO.getEstimatedTime());
            return save(service);
        } else throw new NotFoundException("Service is not found");

    }

    @Override
    public boolean existsById(Integer integer) {
        return serviceRepo.existsById(integer);
    }

    @Override
    public Service deleteService(int id) {
        Optional<Service> serviceData = findById(id);
        if (serviceData.isPresent()) {
            Service service = serviceData.get();
            service.setStatus((short) Constant.SERVICE_STATUS_INACTIVE);
            return save(service);
        } else throw new NotFoundException("Service is not found");


    }

    // load danh service có status bằng 1, active
    @Override
    public List<Service> loadAllActiveService() {
        List<Service> activeList = new ArrayList<>();
        List<Service> serviceList = serviceRepo.findAll();
        for (Service service : serviceList) {
            if (service.getStatus() == 1) {
                activeList.add(service);
            }
        }
        return activeList;
    }

    @Override
    public List<Service> findByServiceTypeIdAndStatus(int id, short status) {
        return serviceRepo.findByServiceTypeIdAndStatus(id, status);
    }

    @Override
    public List<ServiceDiscountComponent> findByServiceTypeIdAndStatusIncludeDiscount(int id, short status) {
        List<Service> serviceList = findByServiceTypeIdAndStatus(id, status);
        List<ServiceDiscountComponent> serviceDiscountComponentList = new ArrayList<>();
        for (Service service : serviceList) {
            ServiceDiscountComponent serviceDiscountComponent = new ServiceDiscountComponent(
                    service,
                    discountService.findAvailableByServiceId(service.getId())
            );
            serviceDiscountComponentList.add(serviceDiscountComponent);
        }
        return serviceDiscountComponentList;
    }

    @Override
    public Page<Service> findAllWithPagination() {
        Page<Service> servicePage = serviceRepo.findAll(PageRequest.of(1, 5));
        return servicePage;
    }

    // Pagation and sort by fields

    @Override
    public Page<Service> findAllWithPaginationAndSorting(String field) {
        Page<Service> servicePage = serviceRepo.findAll(PageRequest.of(1, 5).withSort(Sort.by(field)));
        return servicePage;
    }

    @Override
    public List<Service> findByAppointmentId(Integer appointmentId) {
        return serviceRepo.findByAppointmentId(appointmentId);
    }


    @Override
    public List<Service> filterService(ServiceFilter serviceFilter) {
        return serviceRepo.filterService(serviceFilter.getServiceTypeId(), serviceFilter.getName(), Integer.valueOf(serviceFilter.getStatus()), serviceFilter.getMinPrice(), serviceFilter.getMaxPrice());
    }
}
