package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.domain.DiscountService;
import com.rade.dentistbookingsystem.domain.DiscountServiceKey;
import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.model.DiscountServiceDTO;
import com.rade.dentistbookingsystem.repository.DiscountRepo;
import com.rade.dentistbookingsystem.repository.DiscountServiceRepo;
import com.rade.dentistbookingsystem.repository.ServiceRepo;
import com.rade.dentistbookingsystem.services.DiscountSvService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class DiscountSvImpl implements DiscountSvService {
    DiscountServiceRepo discountServiceRepo;
    @Autowired
    ServiceRepo serviceRepo;
    @Autowired
    DiscountRepo discountRepo;


    public DiscountSvImpl(DiscountServiceRepo discountServiceRepo) {
        this.discountServiceRepo = discountServiceRepo;
    }


    public <S extends DiscountService> S save(S entity) {
        return discountServiceRepo.save(entity);
    }


    @Override
    public List<DiscountService> findByDiscountId(int id) {
        return discountServiceRepo.findAllByDiscount_Id(id);
    }


    @Override
    public DiscountService addServiceDiscount(DiscountServiceDTO discountServiceDTO) {
        DiscountService discountService = new DiscountService();
        Optional<Service> service = serviceRepo.findById(discountServiceDTO.getServiceId());
        Optional<Discount> discount = discountRepo.findById(discountServiceDTO.getDiscountId());

        if (discount.isPresent() && service.isPresent()) {
            DiscountServiceKey discountServiceKey = new DiscountServiceKey();
            discountServiceKey.setDiscountId(discount.get().getId());
            discountServiceKey.setServiceId(service.get().getId());
            discountService.setDiscount(discount.get());
            discountService.setService(service.get());
            discountService.setId(discountServiceKey);
            return discountServiceRepo.save(discountService);
        } else throw new RuntimeException("Can not add");


    }


    @Override
    public void deleteAllByDiscount_Id(int id) {
        discountServiceRepo.deleteAllByDiscount_Id(id);
    }


    @Override
    public DiscountService editServiceDiscount(DiscountServiceDTO discountServiceDTO) {
        return addServiceDiscount(discountServiceDTO);

    }


}
