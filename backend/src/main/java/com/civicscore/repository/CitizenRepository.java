package com.civicscore.repository;


import com.civicscore.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CitizenRepository extends JpaRepository<Citizen, UUID> {
    Optional<Citizen> findByUsername(String username);
}
