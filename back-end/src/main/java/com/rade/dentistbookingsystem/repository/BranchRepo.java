package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.Constant;
import com.rade.dentistbookingsystem.domain.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepo extends JpaRepository<Branch, Integer> {
    public Branch findByUrl(String url);

    public Branch findByName(String name);

    @Query(value =
            "SELECT Branch.* " +
                    "FROM Branch " +
                    "WHERE Branch.id  = ?1 ",
            nativeQuery = true)
    public Branch findId(int id);

    @Query(value =
            "SELECT Branch.*  \n" +
                    "FROM Branch " +
                    "LEFT JOIN Doctor d ON Branch.id = d.branch_id\n" +
                    "WHERE Branch.status = " + Constant.BRANCH_STATUS_ACTIVE + " AND d.status = "+ Constant.DOCTOR_STATUS_ACTIVE +" AND Branch.district_id = :districtId\n" +
                    "GROUP BY Branch.id, Branch.close_time, Branch.open_time, Branch.district_id, Branch.name, Branch.status, Branch.url\n" +
                    "HAVING COUNT(d.id) > 0", nativeQuery = true
    )
    public List<Branch> findAvailablePriorityByDistrictId(@Param("districtId") int districtId);

    @Query(value =
            "SELECT Branch.*  \n" +
                    "FROM Branch " +
                    "LEFT JOIN Doctor d ON Branch.id = d.branch_id\n" +
                    "LEFT JOIN District di ON Branch.district_id = di.id\n" +
                    "WHERE Branch.status = " + Constant.BRANCH_STATUS_ACTIVE + " AND d.status = "+ Constant.DOCTOR_STATUS_ACTIVE +" AND di.province_id = :provinceId\n" +
                    "GROUP BY Branch.id, Branch.close_time, Branch.open_time, Branch.district_id, Branch.name, Branch.status, Branch.url\n" +
                    "HAVING COUNT(d.id) > 0", nativeQuery = true
    )
    public List<Branch> findAvailablePriorityByProvinceId(@Param("provinceId") int provinceId);

    @Query(value =
            "SELECT Branch.*  \n" +
                    "FROM Branch LEFT JOIN Doctor d ON Branch.id = d.branch_id\n" +
                    "WHERE Branch.status = " + Constant.BRANCH_STATUS_ACTIVE + " AND d.status = "+ Constant.DOCTOR_STATUS_ACTIVE +"\n" +
                    "GROUP BY Branch.id, Branch.close_time, Branch.open_time, Branch.district_id, Branch.name, Branch.status, Branch.url\n" +
                    "HAVING COUNT(d.id) > 0", nativeQuery = true
    )
    public List<Branch> findAvailable();

    @Query(value = "SELECT Branch.* FROM Branch WHERE " +
            "(Branch.name LIKE CONCAT('%', :name, '%') OR :name IS NULL OR :name LIKE '')" +
            " AND (Branch.district_id = :districtId) OR :districtId = 0 OR :districtId IS NULL) " +
            " AND(Branch.status = :status) OR :status = 0 OR :status IS NULL)", nativeQuery = true)
    List<Branch> filter(@Param("districtId") int districtId, @Param("name") String name, @Param("status") int status);
}
