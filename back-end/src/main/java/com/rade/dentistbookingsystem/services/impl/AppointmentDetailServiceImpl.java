package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.componentform.JsonAppointment;
import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.domain.AppointmentDetail;
import com.rade.dentistbookingsystem.repository.AppointmentDetailRepo;
import com.rade.dentistbookingsystem.services.AppointmentDetailService;
import com.rade.dentistbookingsystem.services.DiscountService;
import com.rade.dentistbookingsystem.services.ServiceSv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentDetailServiceImpl implements AppointmentDetailService {
    AppointmentDetailRepo appointmentDetailRepo;

    @Autowired
    ServiceSv serviceSv;
    @Autowired
    DiscountService discountService;

    public AppointmentDetailServiceImpl(AppointmentDetailRepo appointmentDetailRepo) {
        this.appointmentDetailRepo = appointmentDetailRepo;
    }

    @Override
    public AppointmentDetail save(AppointmentDetail appointmentDetail) {
        return appointmentDetailRepo.save(appointmentDetail);
    }

    @Override
    public List<AppointmentDetail> save(Appointment appointment, JsonAppointment jsonAppointment) {
        List<AppointmentDetail> appointmentDetailList = new ArrayList<>();
        for (int id : jsonAppointment.getServiceIdList()) {
            AppointmentDetail appointmentDetail = new AppointmentDetail(
                    appointment,
                    serviceSv.findId(id),
                    discountService.findAvailableByServiceId(id)
            );
            appointmentDetailList.add(save(appointmentDetail));
        }
        return appointmentDetailList;
    }

    @Override
    public List<AppointmentDetail> findByAppointmentId(int appointmentId) {
        return appointmentDetailRepo.findByAppointmentId(appointmentId);
    }
}
