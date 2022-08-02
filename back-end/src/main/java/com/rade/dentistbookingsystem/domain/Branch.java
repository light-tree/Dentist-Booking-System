package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Branch")
public class Branch implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, columnDefinition = "nvarchar(30)", unique = true)
    private String name;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(nullable = false, columnDefinition = "varchar(MAX)")
    private String url;

    @Column(name = "open_time", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date openTime;

    @Column(name = "close_time", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date closeTime;

    @Column(nullable = false, columnDefinition = "decimal(1,0)")
    private int status;

    @JsonIgnore
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    private Set<Appointment> appointmentSet;
    @JsonIgnore
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    private Set<Doctor> doctorSet;

    public Branch(String name, District byId, Date openTime, Date closeTime, int status, String url) {
        this.name = name;
        this.district = byId;
        this.url = url;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.status = status;
    }
}
