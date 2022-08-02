package com.rade.dentistbookingsystem.controller.admin;


import com.rade.dentistbookingsystem.componentform.DiscountFilter;
import com.rade.dentistbookingsystem.componentform.DiscountServiceComponentAdmin;
import com.rade.dentistbookingsystem.domain.Discount;
import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.model.DiscountServiceDTO;
import com.rade.dentistbookingsystem.services.DiscountService;
import com.rade.dentistbookingsystem.services.DiscountSvService;
import com.rade.dentistbookingsystem.services.NotificationService;
import com.rade.dentistbookingsystem.services.ServiceSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("rade/admin/discount")
public class DiscountAdminController {
    @Autowired
    DiscountService discount;
    @Autowired
    DiscountSvService discountSv;
    @Autowired
    ServiceSv service;

    @Autowired
    NotificationService notificationService;

    @GetMapping("page/{field}")
    public Page<Discount> discountListPage(@PathVariable String field) {
        int pageSize = 5;
        Pageable pageable = PageRequest.of(1, pageSize, Sort.by(field));

        return discount.findAll(pageable);
    }

    @GetMapping("list")
    public List<Discount> findAllDiscountList() {
        return discount.findAll();
    }

    @GetMapping("list/{field}")
    public List<Discount> findAllDiscountListWithSort(@PathVariable String field) {
        return discount.findAllWithSort(field);
    }

    @PostMapping("filter")
    public List<Discount> filterDiscount(@RequestBody DiscountFilter filter) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date endDate = null;
        if (filter.getEndDate() != null) {
            endDate = sdf.parse(filter.getEndDate());
        }
        else{
            endDate = sdf.parse(sdf.format(new Date()));
        }

        return discount.filterDiscount(filter.getStatus(), filter.getName(), endDate, filter.getServiceId());
    }

    @GetMapping("{id}")
    public Optional<Discount> getDiscount(@PathVariable int id) {

        return discount.findById(id);
    }

    @PostMapping("/add")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> addDiscount(@Validated @RequestBody DiscountServiceComponentAdmin discountServiceComponent) throws ParseException {

        Discount tmpDiscount = discount.addDiscount(discountServiceComponent.getDiscountDTO());
        int discountID = tmpDiscount.getId();
        int[] serviceList = discountServiceComponent.getServiceIDList();
        if (serviceList != null) {

            for (int i = 0; i < serviceList.length; i++) {
                DiscountServiceDTO discountServiceDTO = new DiscountServiceDTO();
                discountServiceDTO.setDiscountId(discountID);
                discountServiceDTO.setServiceId(serviceList[i]);
                discountSv.addServiceDiscount(discountServiceDTO);
            }
            notificationService.newDiscount(tmpDiscount);

            return ResponseEntity.ok(tmpDiscount);

        } else throw new NotFoundException(" Service list not found");

    }

    @PostMapping("/edit")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> updateDiscount(@RequestBody @Validated DiscountServiceComponentAdmin discountServiceComponent) {
        try {

            Discount tmpDiscount = discount.editDiscount(discountServiceComponent.getDiscountDTO());
            int discountID = tmpDiscount.getId();
            discountSv.deleteAllByDiscount_Id(discountID);
            int[] serviceList = discountServiceComponent.getServiceIDList();
            if (serviceList != null) {

                for (int i = 0; i < serviceList.length; i++) {
                    DiscountServiceDTO discountServiceDTO = new DiscountServiceDTO();
                    discountServiceDTO.setDiscountId(discountID);
                    discountServiceDTO.setServiceId(serviceList[i]);
                    discountSv.editServiceDiscount(discountServiceDTO);
                }
                return ResponseEntity.ok(tmpDiscount);

            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();

    }

    @GetMapping("delete/{id}")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> deleteDiscount(@PathVariable int id) {
        Discount tmpDiscount = discount.deleteDiscount(id);
        if (tmpDiscount != null) {
            discountSv.deleteAllByDiscount_Id(tmpDiscount.getId());
        }

        return ResponseEntity.ok(tmpDiscount);

    }

}
