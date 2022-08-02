package com.rade.dentistbookingsystem.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Feedback", uniqueConstraints = {@UniqueConstraint(columnNames = {"appointment_id"})})
public class Feedback implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "appointment_id", referencedColumnName = "id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date time;

    @Column(nullable = false, columnDefinition = "nvarchar(150)")
    private String content;

    @Column(nullable = false, columnDefinition = "decimal(1,0)")
    private int status;

    public Feedback(Appointment appointment, Date time, String content, int status) {
        this.appointment = appointment;
        this.time = time;
        this.content = content;
        this.status = status;
    }
}
