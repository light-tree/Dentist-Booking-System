package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "ServiceType")
public class ServiceType implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false, columnDefinition = "nvarchar(30)", unique = true)
    private String name;

    @Column(name = "description", columnDefinition = "nvarchar(MAX)", nullable = false)
    private String description;
    @JsonIgnore
    @OneToMany(mappedBy = "serviceType", cascade = CascadeType.ALL)
    private Set<Service> serviceSet;


    public ServiceType(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
