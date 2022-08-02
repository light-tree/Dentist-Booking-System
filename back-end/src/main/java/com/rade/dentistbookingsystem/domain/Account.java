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
@Table(name = "Account")
public class Account implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @Column(name = "password", nullable = false, columnDefinition = "nvarchar(MAX)")
    private String password;

    @Column(name = "full_name", nullable = false, columnDefinition = "nvarchar(30)")
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(name = "gender", nullable = false)
    private int gender;

    @Column(name = "phone", length = 10, unique = true)
    private String phone;


    @Column(name = "email", length = 50)
    private String email;

    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @JsonIgnore
    @Column(name = "status", nullable = false, columnDefinition = "decimal(1,0)")
    private short status;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Appointment> appointmentSet;


    @OneToMany(mappedBy = "account")
    @JsonIgnore
    private Set<Notification> notificationSet;

}
