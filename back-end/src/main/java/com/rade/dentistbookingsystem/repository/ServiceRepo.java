package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.domain.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceRepo extends JpaRepository<Service, Integer> {
     List<Service> findByServiceType(ServiceType serviceType);

    List<Service> findByServiceTypeId(int id);

    Service findByName(String name);

    @Query(value = "SELECT * FROM Service WHERE id = ?1", nativeQuery = true)
    Service findId(Integer id);

    List<Service> findByServiceTypeIdAndStatus(int id, short status);

    @Query(value = "SELECT Service.* " +
            "FROM Service, Appointment_Detail ad, Appointment a " +
            "WHERE Service.id = ad.service_id AND ad.appointment_id = a.id AND a.id = :appointment_id", nativeQuery = true)
    List<Service> findByAppointmentId(@Param("appointment_id") Integer appointmentId);

    @Query(value =
            "SELECT DISTINCT Service.* " +
                    "FROM " +
                    "Service " +
                    "WHERE " +
                    "(Service.name LIKE CONCAT('%',:name,'%') OR :name IS NULL OR :name = '') AND " +
                    "(Service.service_type_id = :serviceTypeId OR :serviceTypeId = 0) AND " +
                    "(Service.status = :status OR :status = 0) AND " +
                    "(Service.min_price >= :minPrice OR :minPrice = 0) AND " +
                    " (Service.max_price <= :maxPrice OR :maxPrice = 0)",
            nativeQuery = true)
    List<Service> filterService(@Param("serviceTypeId") int serviceTypeId,
                                @Param("name") String name,
                                @Param("status") Integer status,
                                @Param("minPrice") double minPrice,
                                @Param("maxPrice") double maxPrice);
}
