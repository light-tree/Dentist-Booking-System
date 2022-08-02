package com.rade.dentistbookingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ServiceTypeDTO implements Serializable {
    private int id;
    @NotNull(message = "Service type is required")
    @NotBlank(message = "Service type is required")
    @Size(min = 8, max = 30, message = "ServiceType name's length from 8 to 30")
    private String name;

    @NotNull(message = "Service type ' description is require")
    @NotBlank(message = "Service type ' description is require")
    private String description;
}
