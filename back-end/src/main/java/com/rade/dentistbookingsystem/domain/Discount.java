package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Discount")
public class Discount implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 30, columnDefinition = "nvarchar(30)", unique = true)
    private String name;

    @Column(nullable = false)
    private float percentage;

    @Column(columnDefinition = "nvarchar(MAX)", nullable = false)
    private String description;

    @Column(nullable = false, columnDefinition = "decimal(1,0)")
    private int status;

    @Column(name = "start_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @JsonIgnore
    @OneToMany(mappedBy = "discount")
    private Set<AppointmentDetail> appointmentDetailSet;

    // discount service
    @OneToMany(mappedBy = "discount")
    private Set<DiscountService> discountServiceSet;
}
