package com.civicscore.controller;

import com.civicscore.entity.Appeal;
import com.civicscore.entity.AppealStatus;
import com.civicscore.entity.Citizen;
import com.civicscore.repository.AppealRepository;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.service.AppealService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appeals")
public class AppealController {

    private final AppealService service;
    private final AppealRepository appealRepository;
    private final CitizenRepository citizenRepository;

    public AppealController(AppealService service,
            AppealRepository appealRepository,
            CitizenRepository citizenRepository) {
        this.service = service;
        this.appealRepository = appealRepository;
        this.citizenRepository = citizenRepository;
    }

    // Get all pending appeals (for Admin)
    @GetMapping("/pending")
    public List<Appeal> getPendingAppeals() {
        return appealRepository.findByStatus(AppealStatus.PENDING);
    }

    // Get appeals by citizen
    @GetMapping("/citizen/{citizenId}")
    public List<Appeal> getAppealsByCitizen(@PathVariable UUID citizenId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return appealRepository.findByCitizen(citizen);
    }

    // Citizen raises appeal
    @PostMapping
    public Appeal raiseAppeal(
            @RequestParam Long violationId,
            @RequestParam String reason) {

        return service.raiseAppeal(violationId, reason);
    }

    // Authority resolves appeal
    @PutMapping("/{appealId}")
    public Appeal resolveAppeal(
            @PathVariable Long appealId,
            @RequestParam AppealStatus status) {

        return service.resolveAppeal(appealId, status);
    }
}
