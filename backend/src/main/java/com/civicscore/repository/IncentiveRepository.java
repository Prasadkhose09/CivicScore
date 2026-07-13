package com.civicscore.repository;

import com.civicscore.entity.Incentive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncentiveRepository extends JpaRepository<Incentive, Long> {
}
