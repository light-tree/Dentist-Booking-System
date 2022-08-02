package com.rade.dentistbookingsystem.authetcation;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthRequest {

    @NotNull
    private String phone;

    @NotNull
    private String password;
}
