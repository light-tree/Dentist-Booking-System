package com.rade.dentistbookingsystem.componentform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BranchFilter {
    private String name;
    private int status;
    private int districtId;
}
