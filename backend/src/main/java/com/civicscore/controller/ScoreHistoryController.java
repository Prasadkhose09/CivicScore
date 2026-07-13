package com.civicscore.controller;


import com.civicscore.entity.Citizen;
import com.civicscore.entity.ScoreHistory;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.repository.ScoreHistoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/score-history")
public class ScoreHistoryController {

    private final ScoreHistoryRepository scoreHistoryRepository;
    private final CitizenRepository citizenRepository;


    public ScoreHistoryController(ScoreHistoryRepository scoreHistoryRepository, CitizenRepository citizenRepository) {
        this.scoreHistoryRepository = scoreHistoryRepository;
        this.citizenRepository = citizenRepository;
    }

    @GetMapping("/{citizenId}")
    public List<ScoreHistory> getHistory(@PathVariable UUID citizenId){
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return scoreHistoryRepository.findByCitizenOrderByChangedAtDesc(citizen);
    }

}
