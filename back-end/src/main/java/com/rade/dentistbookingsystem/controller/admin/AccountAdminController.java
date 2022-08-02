package com.rade.dentistbookingsystem.controller.admin;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.JsonPhone;
import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.model.AccountDTO;
import com.rade.dentistbookingsystem.services.AccountService;
import com.rade.dentistbookingsystem.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/admin/account")
public class AccountAdminController {
    @Autowired
    AccountService accountService;

    @Autowired
    AppointmentService appointmentService;

    @GetMapping("accountDetail/{phone}")
    public Account findByPhone(@PathVariable String phone) {
        return accountService.view(phone);
    }


    @GetMapping("list/{roleId}/{status}/phone={phone}")
    public List<Account> getAccountList(@PathVariable(name = "roleId") int roleId, @PathVariable(name = "status") short status, @PathVariable(name = "phone") String phone) {
        if (phone != null && phone.length() > 0) phone = "%" + phone + "%";
        return accountService.getAccountList(roleId, status, phone);
    }

    @GetMapping("{id}")
    public Account findByPhone(@PathVariable int id) {
        return accountService.findId(id);
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@Validated @RequestBody AccountDTO accountDTO) throws Exception {
        Account account = accountService.registerNewUserAccount(accountDTO, Constant.ACCOUNT_ROLE_STAFF);
        if (account != null)
            return ResponseEntity.ok("Register successfully");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Can not register");
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

    @GetMapping("remove/{id}")
    public ResponseEntity<?> removeStaff(@PathVariable Integer id) {
        try {
            Account account = accountService.findId(id);
            if (account.getRole().getId() == Constant.ACCOUNT_ROLE_STAFF) accountService.checkAccount(Constant.ACCOUNT_STATUS_INACTIVE, id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
        return ResponseEntity.ok("Remove Successfully");
    }

    @PostMapping("/ban")
    public ResponseEntity<?> banAccount(@RequestBody JsonPhone jsonPhone) {
        try {
            accountService.editStatus(jsonPhone.getPhone(), Constant.ACCOUNT_STATUS_INACTIVE);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @PostMapping("/unban")
    public ResponseEntity<?> unbanAccount(@RequestBody JsonPhone jsonPhone) {
        try {
            Account account = accountService.findByPhone(jsonPhone.getPhone());
//            if (appointmentService.isAbleToUnBan(account.getId())) {
                accountService.editStatus(jsonPhone.getPhone(), Constant.ACCOUNT_STATUS_ACTIVE);
                return ResponseEntity.ok().build();
//            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @GetMapping("profile")
    public Account viewProfile(@RequestParam String phone) {
        return accountService.view(phone);
    }
}
