package com.rade.dentistbookingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiscountDTO implements Serializable {
    private int id;
    @NotNull
    private String name;
    @NotNull
    private float percentage;
    private String description;
    @Min(value = 1)
    @Max(value = 2)
    private int status;
    @NotNull
    private String startDate;
    @NotNull
    private String endDate;
}
