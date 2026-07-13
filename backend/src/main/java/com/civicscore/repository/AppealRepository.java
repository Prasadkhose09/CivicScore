package com.civicscore.repository;

import com.civicscore.entity.Appeal;
import com.civicscore.entity.AppealStatus;
import com.civicscore.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppealRepository extends JpaRepository<Appeal, Long> {

    List<Appeal> findByStatus(AppealStatus status);

    long countByStatus(AppealStatus status);

    List<Appeal> findByCitizen(Citizen citizen);
}
