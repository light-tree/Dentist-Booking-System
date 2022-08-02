package com.rade.dentistbookingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationDTO implements Serializable {
    private int id;
    private int accountId;
    @NotNull
    @NotEmpty(message = "description is required")
    private String description;

    @NotNull(message = "Date of notification is required")
    private String date;
}
