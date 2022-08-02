package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ServiceFilter implements Serializable {

    private int serviceTypeId;
    private String name;
    private short status;
    private float minPrice;
    private float maxPrice;

}
