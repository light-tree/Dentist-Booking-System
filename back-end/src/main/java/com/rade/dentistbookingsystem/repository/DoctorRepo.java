package com.rade.dentistbookingsystem.repository;

import com.rade.dentistbookingsystem.domain.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepo extends JpaRepository<Doctor, Integer> {
    public List<Doctor> findByBranchIdAndStatus(int branchId, int status);

    @Query(value = "SELECT * FROM Doctor WHERE id = ?1", nativeQuery = true)
    Doctor findId(Integer id);

    int countByBranchId(int branchId);

    @Query(value =
            "SELECT Distinct  Doctor.* " +
                    "FROM " +
                    "Doctor " +
                    "WHERE " +
                    "(Doctor.name LIKE CONCAT('%',:name,'%') OR :name IS NULL) AND " +
                    "(Doctor.status = :status OR  :status IS NULL OR :status = 0) AND " +
                    "(Doctor.branch_id = :branchId OR :branchId IS NULL OR :branchId = 0) "
            , nativeQuery = true)
    List<Doctor> filterDoctor(
            @Param("status") int status,
            @Param("name") String name,
            @Param("branchId") int branchId);
}
