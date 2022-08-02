package com.rade.dentistbookingsystem.controller.admin;

import com.rade.dentistbookingsystem.componentform.ProvinceDistrictComponent;
import com.rade.dentistbookingsystem.domain.Province;
import com.rade.dentistbookingsystem.services.DistrictService;
import com.rade.dentistbookingsystem.services.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("rade/admin/province")
public class ProvinceAdminController {

    @Autowired
    ProvinceService provinceService;
    @Autowired
    DistrictService districtService;

    @GetMapping("list")
    public List<ProvinceDistrictComponent> getProvince() {
        List<ProvinceDistrictComponent> provinceDistrictComponentList = new ArrayList<>();
        List<Province> provinceList = provinceService.findAll();
        for (Province p : provinceList) {
            ProvinceDistrictComponent component = new ProvinceDistrictComponent();
            component.setProvince(p);
            component.setDistrictList(districtService.findByProvinceId(p.getId()));
            provinceDistrictComponentList.add(component);
        }
        return provinceDistrictComponentList;
    }


}
