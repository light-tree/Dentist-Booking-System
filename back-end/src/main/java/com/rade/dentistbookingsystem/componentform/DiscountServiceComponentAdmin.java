package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.model.DiscountDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;

@AllArgsConstructor
@NoArgsConstructor
@Data


public class DiscountServiceComponentAdmin {
    @Valid
    private DiscountDTO discountDTO;

    private int[] serviceIDList;


}
