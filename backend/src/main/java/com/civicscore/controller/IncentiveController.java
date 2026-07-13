package com.civicscore.controller;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.CitizenIncentiveStatus;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.repository.CitizenIncentiveStatusRepository;
import com.civicscore.service.IncentiveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/incentives")
public class IncentiveController {

    private final CitizenRepository citizenRepository;
    private final CitizenIncentiveStatusRepository statusRepository;
    private final IncentiveService incentiveService;

    public IncentiveController(CitizenRepository citizenRepository,
            CitizenIncentiveStatusRepository statusRepository,
            IncentiveService incentiveService) {
        this.citizenRepository = citizenRepository;
        this.statusRepository = statusRepository;
        this.incentiveService = incentiveService;
    }

    @GetMapping("/{citizenId}")
    public List<CitizenIncentiveStatus> getIncentives(@PathVariable UUID citizenId) {

        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        // Check if incentives exist for this citizen, if not evaluate them
        List<CitizenIncentiveStatus> statuses = statusRepository.findByCitizen(citizen);
        if (statuses.isEmpty()) {
            // Evaluate incentives for existing citizens who don't have records
            incentiveService.evaluateIncentives(citizen);
            statuses = statusRepository.findByCitizen(citizen);
        }

        return statuses;
    }
}
