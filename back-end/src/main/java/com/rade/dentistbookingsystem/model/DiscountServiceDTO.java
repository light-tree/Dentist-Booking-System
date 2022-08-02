package com.rade.dentistbookingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiscountServiceDTO implements Serializable {
    @NotNull
    private int serviceId;
    @NotNull
    private int discountId;
}
