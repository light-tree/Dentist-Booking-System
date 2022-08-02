package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.domain.Branch;
import com.rade.dentistbookingsystem.domain.Province;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchListInProvince {
    private Province province;
    private List<Branch> branchList;
}
