package com.rade.dentistbookingsystem.controller.patient;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.model.AccountDTO;
import com.rade.dentistbookingsystem.services.AccountService;
import com.rade.dentistbookingsystem.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("rade/patient/account")
public class AccountPatientController {
    @Autowired
    AccountService accountService;
    @Autowired
    AppointmentService appointmentService;

    @GetMapping("profile")
    public Account viewProfile(@RequestParam String phone) {

        return accountService.view(phone);
    }

    @PostMapping("profile/edit")
    public ResponseEntity<?> edit(@Validated @RequestBody AccountDTO accountDTO) {
        try {

            if (accountService.confirmPassword(accountDTO.getPhone(), accountDTO.getConfirmPassword())) {
                return ResponseEntity.ok(accountService.edit(accountDTO));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Your old password is wrong");
            }


        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }


    }

    @GetMapping("{phone}")
    public ResponseEntity<?> checkValidAccountToMakeAppointment(@PathVariable String phone) {
        try {
            Account account = accountService.findByPhone(phone);
            if (accountService.findByPhone(phone) == null)
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build(); //406
            if (account.getStatus() == Constant.ACCOUNT_STATUS_INACTIVE)
                return ResponseEntity.status(HttpStatus.LOCKED).build(); //423
            if (appointmentService.findByAccountAndStatusIn(account, new int[]{0}) != null)
                return ResponseEntity.status(HttpStatus.GONE).build(); //410
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }
}


