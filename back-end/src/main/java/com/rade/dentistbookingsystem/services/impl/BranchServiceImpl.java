package com.rade.dentistbookingsystem.services.impl;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.componentform.JsonPhone;
import com.rade.dentistbookingsystem.domain.Account;
import com.rade.dentistbookingsystem.domain.Branch;
import com.rade.dentistbookingsystem.exceptions.DuplicateRecordException;
import com.rade.dentistbookingsystem.model.BranchDTO;
import com.rade.dentistbookingsystem.repository.BranchRepo;
import com.rade.dentistbookingsystem.services.AccountService;
import com.rade.dentistbookingsystem.services.BranchService;
import com.rade.dentistbookingsystem.services.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BranchServiceImpl implements BranchService {
    @Autowired
    AccountService accountService;
    @Autowired
    DistrictService districtService;
    private BranchRepo branchRepo;

    public BranchServiceImpl(BranchRepo branchRepo) {
        this.branchRepo = branchRepo;
    }

    @Override
    public List<Branch> findAllWithSort(String field) {
        return branchRepo.findAll(Sort.by(Sort.Direction.DESC, field));
    }

    public List<Branch> findAll() {
        return branchRepo.findAll();
    }

    public Page<Branch> findAll(Pageable pageable) {
        return branchRepo.findAll(pageable);
    }

    @Override
    public <S extends Branch> S save(S entity) {
        return branchRepo.save(entity);
    }

    @Override
    public Branch saveBranch(BranchDTO branchDTO) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        int gapTime = 1000 * 60 * 30;
        try {

            Date openTime = sdf.parse(branchDTO.getOpenTime());
            Date closeTime = sdf.parse(branchDTO.getCloseTime());
            if (branchRepo.findByName(branchDTO.getName()) != null)
                throw new DuplicateRecordException("This branch name already use");
            if (openTime.after(closeTime) || (closeTime.getTime() - openTime.getTime() < gapTime))
                throw new ValidationException("Open time and close time are invalid");
            Branch branch = new Branch(
                    branchDTO.getName(),
                    districtService.getById(branchDTO.getDistrictId()),
                    openTime,
                    closeTime,
                    branchDTO.getStatus(),
                    branchDTO.getUrl());
            return branchRepo.save(branch);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Branch updateBranch(BranchDTO branchDTO, int id) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        int gapTime = 1000 * 60 * 30;
        try {
            if (existsById(id) == false) {
                throw new Exception("Branch not found");
            } else {
                Branch branch = branchRepo.getById(id);
                Date openTime = sdf.parse(branchDTO.getOpenTime());
                Date closeTime = sdf.parse(branchDTO.getCloseTime());
                if (openTime.after(closeTime) || (closeTime.getTime() - openTime.getTime() < gapTime))
                    throw new ValidationException("Open time and close time are invalid");
                branch.setName(branchDTO.getName());
                branch.setStatus(branchDTO.getStatus());
                branch.setUrl(branchDTO.getUrl());
                branch.setDistrict(districtService.getById(branchDTO.getDistrictId()));
                branch.setCloseTime(closeTime);
                branch.setOpenTime(openTime);
                return save(branch);

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public List<Branch> findAvailablePriorityByDistrictId(int districtId) {
        return branchRepo.findAvailablePriorityByDistrictId(districtId);
    }

    @Override
    public List<Branch> findAvailablePriorityByProvinceId(int provinceId) {
        return branchRepo.findAvailablePriorityByProvinceId(provinceId);
    }

    public Optional<Branch> findById(Integer id) {
        return branchRepo.findById(id);
    }

    public boolean existsById(Integer id) {
        return branchRepo.existsById(id);
    }

    public long count() {
        return branchRepo.count();
    }

    public void deleteById(Integer id) {
        branchRepo.deleteById(id);
    }

    public Branch findByName(String name) {
        return branchRepo.findByName(name);
    }

    public Branch findByUrl(String url) {
        return branchRepo.findByUrl(url);
    }

    public Branch findId(int id) {
        return branchRepo.findId(id);
    }

    @Override
    public List<Branch> findAvailable() {
        return branchRepo.findAvailable();
    }

    @Override
    public List<Branch> getListForChoosing(JsonPhone jsonPhone) {
        Account account = accountService.findByPhone(jsonPhone.getPhone());
        List<Branch> branchList = new ArrayList<>();
        if (account == null) return branchList;
        branchList.addAll(findAvailablePriorityByDistrictId(account.getDistrict().getId()));
        List<Branch> branchListByProvince = findAvailablePriorityByProvinceId(account.getDistrict().getProvince().getId());
        branchListByProvince.removeAll(branchList);
        branchList.addAll(branchListByProvince);
        List<Branch> branchListNotRecommend = findAvailable();
        branchListNotRecommend.removeAll(branchList);
        branchList.addAll(branchListNotRecommend);
        return branchList;
    }

    @Override
    public List<Integer> getRecommendList(JsonPhone jsonPhone) {
        Account account = accountService.findByPhone(jsonPhone.getPhone());
        List<Integer> recommendList = new ArrayList<>();
        if (account == null) return recommendList;
        List<Branch> branchList = getListForChoosing(jsonPhone);
        for (Branch branch : branchList) {
            if (account.getDistrict().getId() == branch.getDistrict().getId()) {
                recommendList.add(2);
            } else {
                if (account.getDistrict().getProvince().getId() == branch.getDistrict().getProvince().getId()) {
                    recommendList.add(1);
                } else {
                    recommendList.add(0);
                }
            }
        }
        return recommendList;
    }

    @Override
    public List<Branch> filter(int districtId, String name, int status) {
        return branchRepo.filter(districtId, name, status);
    }
}
