package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.domain.AccountDetail;
import com.rade.dentistbookingsystem.repository.AccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AccountDetailServiceImpl implements UserDetailsService {
    @Autowired
    AccountRepo accountRepo;

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        Account account = accountRepo.findByPhone(phone);

        if (account == null) {
            throw new UsernameNotFoundException("Could not find user");
        }

        return new AccountDetail(account);
    }
}
