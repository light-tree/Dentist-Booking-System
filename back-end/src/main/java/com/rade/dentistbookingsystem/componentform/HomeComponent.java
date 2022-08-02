package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.domain.Branch;
import com.rade.dentistbookingsystem.domain.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class HomeComponent {
    private List<ServiceType> serviceTypeList;
    private List<Branch> branchList;
}
