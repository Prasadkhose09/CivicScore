package com.civicscore.repository;


import com.civicscore.entity.Citizen;
import com.civicscore.entity.ScoreHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreHistoryRepository extends JpaRepository<ScoreHistory, Long> {
    List<ScoreHistory> findByCitizenOrderByChangedAtDesc(Citizen citizen);
}
