package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.repository.RoleRepo;
import com.rade.dentistbookingsystem.services.RoleService;

public class RoleServiceImpl implements RoleService {
    RoleRepo roleRepo;

    public RoleServiceImpl(RoleRepo roleRepo) {
        this.roleRepo = roleRepo;
    }
}
