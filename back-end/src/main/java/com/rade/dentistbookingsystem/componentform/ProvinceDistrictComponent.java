package com.rade.dentistbookingsystem.componentform;

import com.rade.dentistbookingsystem.domain.District;
import com.rade.dentistbookingsystem.domain.Province;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProvinceDistrictComponent implements Serializable {
    Province province;
    List<District> districtList;
}
