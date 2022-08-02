package com.rade.dentistbookingsystem.services;

import com.rade.dentistbookingsystem.componentform.JsonPhone;
import com.rade.dentistbookingsystem.domain.Branch;
import com.rade.dentistbookingsystem.model.BranchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BranchService {

    long count();

    void deleteById(Integer id);

    boolean existsById(Integer id);

    List<Branch> findAllWithSort(String filed);

    List<Branch> findAll();

    Page<Branch> findAll(Pageable pageable);

    <S extends Branch> S save(S entity);

    Branch saveBranch(BranchDTO branchDTO);

    Branch updateBranch(BranchDTO branchDTO, int id);


    List<Branch> findAvailablePriorityByDistrictId(int districtId);

    List<Branch> findAvailablePriorityByProvinceId(int provinceId);

    Optional<Branch> findById(Integer id);

    Branch findByName(String name);

    Branch findByUrl(String url);

    Branch findId(int id);

    List<Branch> findAvailable();

    List<Branch> getListForChoosing(JsonPhone jsonPhone);

    List<Integer> getRecommendList(JsonPhone jsonPhone);

    List<Branch> filter(int districtId, String name, int status);
}
