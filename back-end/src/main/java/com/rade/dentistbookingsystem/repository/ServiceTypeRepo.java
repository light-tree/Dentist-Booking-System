package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceTypeRepo extends JpaRepository<ServiceType, Integer> {
     ServiceType findByName(String name);

    @Query(value = "SELECT * FROM ServiceType WHERE id = ?1", nativeQuery = true)
    ServiceType findId(Integer id);

    @Query(value = "SELECT ServiceType.*\n" +
            "FROM ServiceType LEFT JOIN Service s ON ServiceType.id = s.service_type_id\n" +
            "WHERE s.status = 1\n" +
            "GROUP BY ServiceType.id, ServiceType.name, ServiceType.description\n" +
            "HAVING COUNT(s.id) > 0", nativeQuery = true)
    List<ServiceType> findAllHavingService();
}
