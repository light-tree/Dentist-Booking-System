package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<Role, Integer> {
}
