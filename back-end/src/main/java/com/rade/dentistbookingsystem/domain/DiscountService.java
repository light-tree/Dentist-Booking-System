package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Discount_Service")

public class DiscountService implements Serializable {
    @EmbeddedId
    private DiscountServiceKey id;

    @ManyToOne
    @MapsId("service_id")
    @JsonIncludeProperties({"service_id", "name"})
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne
    @MapsId("discount_id")
    @JsonIgnore
    @JoinColumn(name = "discount_id")
    private Discount discount;

}
