package com.rade.dentistbookingsystem.domain;

import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@NoArgsConstructor
public class AccountDetail implements UserDetails {

    private Account account;

    public AccountDetail(Account account) {
        this.account = account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Role role = account.getRole();

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.getName()));
        return authorities;
    }


    @Override
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        return account.getPhone();
    }

    public String getRoleName() {
        return account.getRole().getName();
    }

    public int getStatus(){
        return account.getStatus();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {


        return account.getStatus() == 1;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
