package com.rade.dentistbookingsystem.controller.patient;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.*;
import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.domain.Appointment;
import com.rade.dentistbookingsystem.domain.Doctor;
import com.rade.dentistbookingsystem.domain.Service;
import com.rade.dentistbookingsystem.model.AppointmentDTO;
import com.rade.dentistbookingsystem.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/patient/appointment")
public class AppointmentPatientController {
    @Autowired
    ServiceSv serviceSv;
    @Autowired
    ServiceTypeSv serviceTypeSv;
    @Autowired
    BranchService branchService;
    @Autowired
    DiscountService discountService;
    @Autowired
    DoctorService doctorService;
    @Autowired
    AppointmentService appointmentService;
    @Autowired
    AppointmentDetailService appointmentDetailService;
    @Autowired
    AccountService accountService;


    @GetMapping("{branchId}")
    public AppointmentComponent chooseBranch(@PathVariable int branchId) {

        ArrayList<ServiceDiscountComponent> serviceDiscountComponentList = new ArrayList<>();
        for (Service service : serviceSv.findAll()) {
            serviceDiscountComponentList.add(new ServiceDiscountComponent(
                    service,
                    discountService.findAvailableByServiceId(service.getId())
            ));
        }
        return new AppointmentComponent(
                new AppointmentDTO(branchId),
                serviceDiscountComponentList,
                serviceTypeSv.findAllHavingService(),
                branchService.findId(branchId),
                doctorService.findByBranchIdAndStatus(branchId, Constant.BRANCH_STATUS_ACTIVE)
        );
    }

    @PostMapping("make")
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public ResponseEntity<?> makeAppointment(@RequestBody @Valid JsonAppointment jsonAppointment) {
        try {
            Account account = accountService.findByPhone(jsonAppointment.getPhone());
            if (account == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            if (account.getStatus() == Constant.ACCOUNT_STATUS_INACTIVE)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            if (appointmentService.findByAccountAndStatusIn(account, new int[]{Constant.APPOINTMENT_STATUS_WAITING}) != null)
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
            if (jsonAppointment.getServiceIdList().length == 0)
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
            Appointment appointment = appointmentService.checkValidAndSave(jsonAppointment);
            if (appointmentDetailService.save(appointment, jsonAppointment).size() == jsonAppointment.getServiceIdList().length) {
                return ResponseEntity.ok(appointment);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @PostMapping("load-update")
    public AppointmentComponentForUpdate loadToUpdate(@RequestBody JsonPhoneAndAppointmentId jsonPhoneAndAppointmentId) {
        try {
            Account account = accountService.findByPhone(jsonPhoneAndAppointmentId.getPhone());
            if (account == null)
                return null;
            if (account.getStatus() == Constant.ACCOUNT_STATUS_INACTIVE)
                return null;
            Appointment appointment = appointmentService.findId(jsonPhoneAndAppointmentId.getAppointmentId());
            if (!(appointment != null && appointment.getAccount().getId() == account.getId()))
                return null;
            if (appointment.getStatus() != Constant.APPOINTMENT_STATUS_WAITING)
                return null;
            List<Doctor> doctorList = doctorService.findByBranchIdAndStatus(appointment.getBranch().getId(), 1);
            List<Service> serviceList = serviceSv.findByAppointmentId(appointment.getId());
            return new AppointmentComponentForUpdate(appointment, doctorList, serviceList);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping("update")
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public ResponseEntity<?> updateAppointment(@RequestBody JsonAppointment jsonAppointment) {
        try {
            Account account = accountService.findByPhone(jsonAppointment.getPhone());
            if (account == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); //ko tìm thấy account
            if (account.getStatus() == Constant.ACCOUNT_STATUS_INACTIVE)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); //account bị ban
            Appointment appointment = appointmentService.findId(jsonAppointment.getAppointmentDTO().getId());
            if (!(appointment != null && appointment.getAccount().getId() == account.getId()))
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); //appointment không tồn tại (chung với tài khoản không khớp với appointment)
            if (!(appointment.getStatus() == Constant.APPOINTMENT_STATUS_WAITING && appointmentService.checkAppointmentToCancel(appointment.getId(), account.getId())))
                return ResponseEntity.status(HttpStatus.GONE).build(); //appointment phải là đang chờ và chưa được edit
            if (appointmentService.checkValidAndSave(jsonAppointment) != null) {
                return ResponseEntity.ok(appointment);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @PostMapping("history")
    public List<Appointment> getHistoryList(@RequestBody PhoneAndPage phoneAndPage) {
        String phone = phoneAndPage.getPhone();
        int accountId = accountService.findByPhone(phone).getId();
        int page = phoneAndPage.getPage();
        Pageable pageable = PageRequest.of(page - 1, Constant.SIZE_OF_PAGE_FOR_HISTORY_OF_PATIENT_VIEW, Sort.by("id").descending());
        return appointmentService.findByAccountId(accountId, pageable);
    }

    @GetMapping("history/{id}")
    public Appointment viewHistoryById(@PathVariable int id) {
        return appointmentService.findId(id);
    }


    @PostMapping("cancel")
    public ResponseEntity<?> cancelAppointment(@RequestBody JsonPhoneAndAppointmentId jsonPhoneAndAppointmentId) {
        try {
            String phone = jsonPhoneAndAppointmentId.getPhone();
            ;
            int appointmentId = jsonPhoneAndAppointmentId.getAppointmentId();
            Account account = accountService.findByPhone(phone);
            if (!(account != null && account.getStatus() == Constant.ACCOUNT_STATUS_ACTIVE))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // tài khoản phải tồn tại và ko bị ban
            Appointment appointment = appointmentService.findId(appointmentId);
            if (!(appointment != null && appointment.getAccount().getId() == account.getId()))
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); //lịch cancel phải là của tài khoản đó
            if (appointmentService.checkAppointmentToCancel(appointmentId, account.getId())) {
                if (appointmentService.checkCountAppointmentToCancel(account.getId())) {
                    appointmentService.check(Constant.APPOINTMENT_STATUS_CANCEL, appointment.getId());
                    return ResponseEntity.status(HttpStatus.OK).build();
                } else {
                    return ResponseEntity.status(HttpStatus.LOCKED).build(); //quá 3 cancel/tháng
                }
            } else {
                return ResponseEntity.status(HttpStatus.GONE).build(); //quá hạn hoặc không có lịch hẹn đang chờ
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
    }

    @PostMapping("check-doctor")
    public List<TimeOption> checkTimeOptionOfDoctorByDate(@RequestBody DoctorAndDate doctorAndDate) throws Exception {
        List<TimeOption> timeOptionList = new ArrayList<>();
        for (String stringOption : appointmentService.checkTimeOptionByDate(doctorAndDate)) {
            TimeOption option = new TimeOption(stringOption);
            timeOptionList.add(option);
        }
        Collections.sort(timeOptionList);
        return timeOptionList;
    }


}
