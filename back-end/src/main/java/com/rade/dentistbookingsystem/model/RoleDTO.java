package com.rade.dentistbookingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoleDTO implements Serializable {
    private int id;
    private String name;
}
