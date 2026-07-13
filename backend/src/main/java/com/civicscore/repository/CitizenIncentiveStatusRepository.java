package com.civicscore.repository;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.CitizenIncentiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CitizenIncentiveStatusRepository extends JpaRepository<CitizenIncentiveStatus, Long> {
    List<CitizenIncentiveStatus> findByCitizen(Citizen citizen);
}
