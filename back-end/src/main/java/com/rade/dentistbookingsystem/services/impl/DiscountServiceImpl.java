package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.model.DiscountDTO;
import com.rade.dentistbookingsystem.repository.AccountRepo;
import com.rade.dentistbookingsystem.repository.DiscountRepo;
import com.rade.dentistbookingsystem.services.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import javax.validation.ValidationException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountServiceImpl implements DiscountService {
    DiscountRepo discountRepo;
    @Autowired
    AccountRepo accountRepo;

    public DiscountServiceImpl(DiscountRepo discountRepo) {
        this.discountRepo = discountRepo;
    }

    public Discount findAvailableByServiceId(Integer id) {
        return discountRepo.findAvailableByServiceId(id);
    }

    @Override
    public List<Discount> findAll() {
        return discountRepo.findAll();
    }

    @Override
    public List<Discount> findAllWithSort(String field) {
        return discountRepo.findAll(Sort.by(Sort.Direction.DESC, field));
    }

    @Override
    public Page<Discount> findAll(Pageable pageable) {
        return discountRepo.findAllByStatus(Constant.DISCOUNT_STATUS_ACTIVE, pageable);
    }

    @Override
    public List<Discount> filterDiscount(int status, String name, Date endDate, int serviceId) {
        return discountRepo.filterDiscount(status, name, endDate, serviceId);
    }

    @Override
    public Page<Discount> findAllWithPagination() {
        return discountRepo.findAllByStatus(Constant.DISCOUNT_STATUS_ACTIVE, PageRequest.of(0, 5));
    }


    @Override
    public Optional<Discount> findById(Integer integer) {
        return discountRepo.findById(integer);
    }

    public Discount findByName(String name) {
        return discountRepo.findByName(name);
    }

    public <S extends Discount> S save(S entity) {
        return discountRepo.save(entity);
    }

    @Override
    public Discount addDiscount(@Valid DiscountDTO discountDTO) throws ParseException {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Discount tmpDiscount = findByName(discountDTO.getName());
        if (tmpDiscount != null)
            throw new ValidationException("This Discount name has been use");
        Discount discount = new Discount();
        discount.setName(discountDTO.getName());
        discount.setStatus(discountDTO.getStatus());
        discount.setPercentage(discountDTO.getPercentage());
        discount.setDescription(discountDTO.getDescription());
        Date today = new Date();
        Date startDate = dateFormat.parse(discountDTO.getStartDate());
        Date endDate =  dateFormat.parse(discountDTO.getEndDate());
        if(startDate.before(today) || startDate.after(endDate))
            throw new ValidationException("Invalid time");
        discount.setStartDate(startDate);
        discount.setEndDate(endDate);

        return save(discount);

    }


    @Override
    public Discount editDiscount(DiscountDTO discountDTO) throws ParseException {

        Optional<Discount> discount = discountRepo.findById(discountDTO.getId());
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        if (discount.isPresent()) {

            if (discountRepo.findByName(discountDTO.getName()) != null && discountRepo.findByName(discountDTO.getName()).getId() != discountDTO.getId())
                throw new ValidationException("This Discount name has already exits");

            Discount tmpDiscount = discount.get();
            tmpDiscount.setName(discountDTO.getName());
            tmpDiscount.setStatus(discountDTO.getStatus());
            tmpDiscount.setPercentage(discountDTO.getPercentage());
            tmpDiscount.setDescription(discountDTO.getDescription());
            tmpDiscount.setStartDate(dateFormat.parse(discountDTO.getStartDate()));
            tmpDiscount.setEndDate(dateFormat.parse(discountDTO.getEndDate()));
            return save(tmpDiscount);
        } else throw new NotFoundException("Discount not found");
    }


    @Override
    public Discount deleteDiscount(int discountId) {
        Optional<Discount> discount = discountRepo.findById(discountId);
        if (discount.isPresent()) {
            discount.get().setStatus(Constant.DISCOUNT_STATUS_INACTIVE);
            return discount.get();
        } else throw new NotFoundException("Discount is not found");
    }


}
