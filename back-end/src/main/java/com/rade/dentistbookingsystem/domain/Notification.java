package com.rade.dentistbookingsystem.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "Notification")
public class Notification implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "account_id", nullable = true)
    private Account account;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String description;

    @Column(name = "date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date date;

    public Notification(Account account, String description, Date date) {
        this.account = account;
        this.description = description;
        this.date = date;
    }
}
