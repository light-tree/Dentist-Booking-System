package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.DiscountService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscountServiceRepo extends JpaRepository<DiscountService, Integer> {
    void deleteAllByDiscount_Id(int discount_id);

    List<DiscountService> findAllByDiscount_Id(int discount_id);
}
