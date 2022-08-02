package com.rade.dentistbookingsystem.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Doctor")
public class Doctor implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, columnDefinition = "nvarchar(30)")
    private String name;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String description;

    @Column(nullable = false, columnDefinition = "varchar(MAX)")
    private String url;

    @Column(nullable = false, columnDefinition = "decimal(1,0)")
    private int status;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
}
