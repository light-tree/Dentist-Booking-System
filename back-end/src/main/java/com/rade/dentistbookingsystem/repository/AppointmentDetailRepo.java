package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.AppointmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentDetailRepo extends JpaRepository<AppointmentDetail, Integer> {
    List<AppointmentDetail> findByAppointmentId(int appointmentId);
}
