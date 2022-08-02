package com.rade.dentistbookingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ServiceDTO implements Serializable {

    private int id;
    @NotNull(message = "Service type id is required")
    private int serviceTypeId;

    @NotNull(message = "Service type name is required")
    @NotBlank(message = "Service type name is required")
    @NotEmpty(message = "Service type name is required")
    @Size(min = 8, max = 30, message = "Service name's length from 8 to 30")
    private String name;

    //    @NotNull(message = "Service image is required")
//    @NotEmpty(message = "Service image is required")
    private String url;

    @NotNull(message = "Service description is required")
    @NotBlank(message = "Service description is required")
    @NotEmpty(message = "Service description is required")
    private String description;

    @NotNull(message = "Service status must be defined")
    private short status;

    @NotNull(message = "Service min price is required")
    @Min(value = 1, message = " Min price must be  greater than 0")
    private float minPrice;

    @NotNull(message = "Service estimated time is required")
    private float estimatedTime;
    @NotNull(message = "Service max price is required")
    @Min(value = 1, message = " Max price must be  greater than 0")
    private float maxPrice;

}
