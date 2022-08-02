package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Appointment")
public class Appointment implements Serializable, Comparable<Appointment> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne()
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "appointment_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private String appointmentTime;

    @Column(name = "status", nullable = false, columnDefinition = "decimal(1,0)")
    private int status;

    @Column(name = "time_making", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeMaking;

    @Column(name = "note", columnDefinition = "nvarchar(MAX)")
    private String note;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<AppointmentDetail> appointmentDetailSet;

    @JsonIgnore
    @OneToOne(mappedBy = "appointment")
    private Feedback feedback;

    public Appointment(Account account, Branch branch, Doctor doctor, Date date, String time, int status, Date timeMaking) {
        this.account = account;
        this.branch = branch;
        this.doctor = doctor;
        this.appointmentDate = date;
        this.appointmentTime = time;
        this.status = status;
        this.timeMaking = timeMaking;
    }

    @Override
    public int compareTo(Appointment appointment) {
        return this.timeMaking.compareTo(appointment.getTimeMaking());
    }

}
