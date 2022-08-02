package com.rade.dentistbookingsystem.controller.admin;

import com.rade.dentistbookingsystem.componentform.BranchFilter;
import com.rade.dentistbookingsystem.domain.Branch;
import com.rade.dentistbookingsystem.exceptions.NotFoundException;
import com.rade.dentistbookingsystem.model.BranchDTO;
import com.rade.dentistbookingsystem.services.BranchService;
import com.rade.dentistbookingsystem.services.DistrictService;
import com.rade.dentistbookingsystem.services.ProvinceService;
import com.rade.dentistbookingsystem.utils.image.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("rade/admin/branch")

public class BranchAdminController {

    @Autowired
    BranchService branchService;
    @Autowired
    ProvinceService provinceService;
    @Autowired
    DistrictService districtService;

    @Autowired
    ImageService imageService;

    @GetMapping("/{id}")
    public Branch findById(@PathVariable int id) {
        Branch branch = branchService.findId(id);
        if (branch != null) {
            return branch;
        } else throw new NotFoundException("Branch is not found ");

    }

    @GetMapping("filter")
    public List<Branch> filterByStatus(@RequestBody BranchFilter branchFilter) {

        return branchService.filter(branchFilter.getStatus(), branchFilter.getName(), branchFilter.getDistrictId());
    }

    @PostMapping(value = "add-image")
    public ResponseEntity<?> addBranchImg(@RequestParam MultipartFile url) throws Exception {
        String id;
        try {
            id = imageService.validateAndDownload(url);
            if (id != null)
                return ResponseEntity.ok(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(e);
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }


    @GetMapping("list")
    public List<Branch> getListBranch() {
        return branchService.findAll();
    }


    @GetMapping("list/{field}")
    public List<Branch> getListBranchWithSorting(@PathVariable String field) {
        return branchService.findAllWithSort(field);
    }

    @PostMapping("add")
    //@ExceptionHandler({NotFoundException.class, DuplicateRecordException.class})
    public ResponseEntity<?> addBranch(@Valid @RequestBody BranchDTO branchDTO) throws Exception {
        Branch branch = branchService.saveBranch(branchDTO);
        if (branch != null)
            return ResponseEntity.status(HttpStatus.CREATED).build();
        else {
            imageService.removeImg(branchDTO.getUrl());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
    }

    @PostMapping("edit")
    public ResponseEntity<?> updateBranch(@Valid @RequestBody BranchDTO branchDTO) throws Exception {
        System.out.println(branchDTO.getUrl());
        Branch branch = branchService.updateBranch(branchDTO, branchDTO.getId());
        if (branch != null)
            return ResponseEntity.status(HttpStatus.OK).build();
        else {
            imageService.removeImg(branchDTO.getUrl());
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
    }
}
