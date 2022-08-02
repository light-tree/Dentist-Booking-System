package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.model.DiscountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.validation.Valid;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface DiscountService {
    Discount findAvailableByServiceId(Integer id);


    List<Discount> findAll();

    List<Discount> findAllWithSort(String field);

    Page<Discount> findAll(Pageable pageable);

    Page<Discount> findAllWithPagination();

    Optional<Discount> findById(Integer integer);

    Discount addDiscount(@Valid DiscountDTO discountDTO) throws ParseException;

    Discount editDiscount(DiscountDTO discountDTO) throws ParseException;

    Discount deleteDiscount(int discountId);

    List<Discount> filterDiscount(int status, String name, Date endDate, int serviceId);


}
