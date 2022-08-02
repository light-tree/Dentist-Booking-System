package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Appointment_Detail")
public class AppointmentDetail implements Serializable {
    @EmbeddedId
    private AppointmentDetailKey id;

    @ManyToOne
    @MapsId("service_id")
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne
    @JsonIgnore
    @MapsId("appointment_id")
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne()
    @JoinColumn(name = "discount_id")
    private Discount discount;

    public AppointmentDetail(Appointment appointment, Service service, Discount discount) {
        this.id = new AppointmentDetailKey(service.getId(), appointment.getId());
        this.appointment = appointment;
        this.service = service;
        this.discount = discount;
    }
}
