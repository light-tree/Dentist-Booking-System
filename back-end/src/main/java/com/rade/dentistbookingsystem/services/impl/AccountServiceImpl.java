package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.model.AccountDTO;
import com.rade.dentistbookingsystem.repository.AccountRepo;
import com.rade.dentistbookingsystem.repository.DistrictRepo;
import com.rade.dentistbookingsystem.repository.RoleRepo;
import com.rade.dentistbookingsystem.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {
    AccountRepo accountRepo;
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    RoleRepo roleRepo;

    @Autowired
    DistrictRepo districtRepo;

    public AccountServiceImpl(AccountRepo accountRepo) {
        this.accountRepo = accountRepo;
    }

    public Account findId(int id) {
        return accountRepo.findId(id);
    }

    @Override
    public <S extends Account> S save(S entity) {
        return accountRepo.save(entity);
    }

    @Override
    public boolean isRegistrable(AccountDTO accountDTO) {
        if (accountRepo.findByPhone(accountDTO.getPhone()) != null) return false;
        else return true;
    }

    @Override
    public Account registerNewUserAccount(AccountDTO accountDTO, int role) throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        if (accountRepo.findByPhone(accountDTO.getPhone()) != null) {
            throw new Exception(
                    accountDTO.getPhone() + "is already exist");
        }
        Account account = new Account();
        account.setFullName(accountDTO.getFullName());
        account.setPhone(accountDTO.getPhone());
        account.setDateOfBirth(dateFormat.parse(accountDTO.getDateOfBirth()));
        account.setRole(roleRepo.getById(role));
        account.setStatus((short) 1);
        account.setEmail(accountDTO.getEmail());
        account.setPassword(bCryptPasswordEncoder.encode(accountDTO.getPassword()));
        account.setDistrict(districtRepo.getById(accountDTO.getDistrictId()));
        account.setGender(accountDTO.getGender());
        return save(account);
    }

    @Override
    public Account view(String phone) {
        Account account = accountRepo.findByPhone(phone);
        account.setPassword("*******");
        return account;

    }

    @Override
    public Account edit(AccountDTO accountDTO) throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Account account = accountRepo.findByPhone(accountDTO.getPhone());
        if (account == null || account.getStatus() == Constant.ACCOUNT_STATUS_INACTIVE) {
            throw new Exception("Can not edit!! please try again");
        } else {
            account.setFullName(accountDTO.getFullName());
            account.setDateOfBirth(dateFormat.parse(accountDTO.getDateOfBirth()));
            account.setEmail(accountDTO.getEmail());
            account.setPassword(bCryptPasswordEncoder.encode(accountDTO.getPassword()));
            account.setDistrict(districtRepo.getById(accountDTO.getDistrictId()));
            account.setGender(accountDTO.getGender());
            return save(account);
        }
    }

    @Override
    public boolean confirmPassword(String phone, String password) {
        Account account = accountRepo.findByPhone(phone);
        if (account == null) throw new NotFoundException("Phone number are not found");
        else {
            if (bCryptPasswordEncoder.matches(password, account.getPassword())) {
                return true;
            }

        }
        return false;
    }

    @Override
    public Account findByPhone(String phone) {
        return accountRepo.findByPhone(phone);
    }

    @Override
    public void checkAccount(Integer status, Integer id) {
        accountRepo.checkAccount(status, id);
    }

    @Override
    public List<Account> getAccountList(int roleId, short status, String phone) {
        return accountRepo.filterAccount(roleId, status, phone);
    }

    @Override
    public boolean editStatus(String phone, int status) throws Exception {
        Account account = accountRepo.findByPhone(phone);
        if (account != null && account.getRole().getId() != Constant.ACCOUNT_ROLE_ADMIN) {
            account.setStatus((short) status);
            accountRepo.save(account);
            return true;

        } else throw new Exception("You do not allow to edit");

    }
}