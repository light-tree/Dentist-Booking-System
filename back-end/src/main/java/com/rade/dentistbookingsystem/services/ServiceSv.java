package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.componentform.ServiceDiscountComponent;
import com.rade.dentistbookingsystem.componentform.ServiceFilter;
import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.domain.ServiceType;
import com.rade.dentistbookingsystem.model.ServiceDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ServiceSv {
    List<Service> findByServiceType(ServiceType serviceType);

    <S extends Service> S save(S entity);

    Service insert(ServiceDTO serviceDTO) throws Exception;

    List<Service> findByServiceTypeId(int id);

    List<Service> findAll();

    Service findId(Integer id);

    Optional<Service> findById(Integer integer);

    Service edit(ServiceDTO serviceDTO);

    boolean existsById(Integer integer);

    Service deleteService(int id);

    // load danh service có status bằng 1, active
    List<Service> loadAllActiveService();

    List<Service> findByServiceTypeIdAndStatus(int id, short status);

    List<ServiceDiscountComponent> findByServiceTypeIdAndStatusIncludeDiscount(int id, short status);

    Page<Service> findAllWithPagination();

    Page<Service> findAllWithPaginationAndSorting(String field);

    List<Service> findByAppointmentId(Integer appointmentId);

    List<Service> filterService(ServiceFilter serviceFilter);
}
