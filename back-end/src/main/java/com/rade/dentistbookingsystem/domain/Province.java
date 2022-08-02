package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Province")
public class Province implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, name = "name", columnDefinition = "nvarchar(30)", unique = true)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "province", cascade = CascadeType.ALL)
    private Set<District> districtSet;
}
