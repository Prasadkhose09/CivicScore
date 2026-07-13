package com.civicscore.repository;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Violation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ViolationRepository extends JpaRepository<Violation, Long> {

    List<Violation> findByCitizen(Citizen citizen);

    long countByViolationTimeAfter(LocalDateTime time);

    @Query("SELECT AVG(c.currentScore) FROM Citizen c")
    Double findAverageScore();
}
