package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.componentform.*;
import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.model.AppointmentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.text.ParseException;
import java.util.List;

public interface AppointmentService {
//    abstract Appointment save(AppointmentDTO appointmentDTO);

    Appointment save(AppointmentDTO appointmentDTO);

    Appointment addNote(JsonNoteForAppointment noteForAppointment);

    Page<Appointment> findAll(Pageable pageable);

    Appointment findId(int id);

    void check(Integer status, Integer id);

    List<Appointment> findByAccountId(int accountId, Pageable pageable);


    Appointment findByAccountAndStatusIn(Account account, int[] status);

    boolean checkAppointmentToCancel(int id, int accountId);

    List<String> checkTimeOptionOfDoctorByDate(DoctorAndDate doctorAndDate) throws Exception;

    List<String> checkTimeOptionByDate(DoctorAndDate doctorAndDate) throws Exception;

    Appointment checkValidAndSave(JsonAppointment jsonAppointment);

    boolean checkCountAppointmentToCancel(int accountId);

    List<Appointment> findAllAppointmentToMarkAbsent();

    boolean checkAccountToBanByAppointment(int accountId);

    Appointment findAppointmentByAccountIdInNext24h(Integer accountId);


    List<Appointment> filterAppointment(AppointmentComponentForFilter appointmentComponentForFilter) throws ParseException;

    Appointment cancelAppointmentForAdmin(int appointmentId);

    Appointment checkDoneAppointmentForAdmin(int appointmentId);

    boolean isAbleToUnBan(int accountId);

    List<Appointment> findByPhoneAndStatusInByOrderByIdDesc(String phone, Integer[] status);

    ReportData getReportData(Integer month, int year);
}

