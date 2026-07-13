package com.civicscore.controller;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Severity;
import com.civicscore.entity.Violation;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.repository.ViolationRepository;
import com.civicscore.service.ViolationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/violations")
public class ViolationController {

    private final ViolationService service;
    private final ViolationRepository violationRepository;
    private final CitizenRepository citizenRepository;

    public ViolationController(ViolationService service,
            ViolationRepository violationRepository,
            CitizenRepository citizenRepository) {
        this.service = service;
        this.violationRepository = violationRepository;
        this.citizenRepository = citizenRepository;
    }

    // Get violations by citizen
    @GetMapping("/citizen/{citizenId}")
    public List<Violation> getViolationsByCitizen(@PathVariable UUID citizenId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return violationRepository.findByCitizen(citizen);
    }

    @PostMapping
    public Violation addViolation(
            @RequestParam UUID citizenId,
            @RequestParam Severity severity,
            @RequestParam String description) {

        return service.addViolation(citizenId, severity, description);
    }
}
