package com.rade.dentistbookingsystem.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Embeddable
public class DiscountServiceKey implements Serializable {
    @Column(name = "service_id")
    private int serviceId;

    @Column(name = "discount_id")
    private int discountId;
}
