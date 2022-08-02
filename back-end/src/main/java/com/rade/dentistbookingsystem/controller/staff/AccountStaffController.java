package com.rade.dentistbookingsystem.controller.staff;

import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.model.AccountDTO;
import com.rade.dentistbookingsystem.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
@RequestMapping("rade/staff/account")
public class AccountStaffController {
    @Autowired
    AccountService accountService;

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

    @GetMapping("profile")
    public Account viewProfile(@RequestParam String phone) {
        return accountService.view(phone);
    }
}
