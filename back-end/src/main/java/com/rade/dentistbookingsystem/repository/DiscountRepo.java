package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface DiscountRepo extends JpaRepository<Discount, Integer> {
    @Query(value =
            "SELECT Discount.* " +
                    "FROM Discount, Discount_Service ds " +
                    "WHERE Discount.id = ds.discount_id AND ds.service_id = ?1 AND Discount.status = "+ Constant.DISCOUNT_STATUS_ACTIVE +" " +
                    "AND getdate() >= Discount.start_date AND getdate() <= Discount.end_date " +
                    "AND Discount.percentage >= ALL( " +
                    "SELECT Discount.percentage " +
                    "FROM Discount Discount, Discount_Service ds " +
                    "WHERE Discount.id = ds.discount_id AND ds.service_id = ?1 " +
                    "AND getdate() >= Discount.start_date AND getdate() <= Discount.end_date AND Discount.status = "+ Constant.DISCOUNT_STATUS_ACTIVE +")",
            nativeQuery = true)
    Discount findAvailableByServiceId(Integer id);

    public Discount findByName(String name);

    Page<Discount> findAllByStatus(int status, Pageable pageable);

    @Query(value =
            "SELECT Distinct  Discount.* " +
                    "FROM " +
                    "Discount, Discount_Service " +
                    "WHERE " +
                    "(Discount.name LIKE CONCAT('%',:name,'%') OR :name IS NULL OR :name ='') AND " +
                    "(Discount.status = :status OR :status = 0) AND " +
                    "((:date >= Discount.start_date AND :date <= Discount.end_date) OR :date IS NULL) AND " +
                    "(Discount_Service.service_id = :serviceId OR :serviceId = 0)"
            , nativeQuery = true)
    List<Discount> filterDiscount(
            @Param("status") int status,
            @Param("name") String name,
            @Param("date") Date date,
            @Param("serviceId") int serviceId);
}
