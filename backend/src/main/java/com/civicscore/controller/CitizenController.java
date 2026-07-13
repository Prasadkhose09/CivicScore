package com.civicscore.controller;

import com.civicscore.entity.Citizen;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.service.CitizenService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/citizens")
public class CitizenController {

    private final CitizenService service;
    private final CitizenRepository citizenRepository;

    public CitizenController(CitizenService service, CitizenRepository citizenRepository) {
        this.service = service;
        this.citizenRepository = citizenRepository;
    }

    // Get all citizens (for Admin)
    @GetMapping
    public List<Citizen> getAllCitizens() {
        return citizenRepository.findAll();
    }

    // Get citizen by ID
    @GetMapping("/{citizenId}")
    public Citizen getCitizenById(@PathVariable UUID citizenId) {
        return citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
    }

    @PostMapping
    public Citizen create(@RequestParam String name) {
        return service.createCitizen(name);
    }

    @GetMapping("/{citizenId}/score")
    public int getCitizenScore(@PathVariable UUID citizenId) {
        return service.getCitizenScore(citizenId);
    }
}
