package com.civicscore.service;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Role;
import com.civicscore.repository.CitizenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CitizenService {

    private final CitizenRepository repository;
    private final IncentiveService incentiveService;
    private final PasswordEncoder passwordEncoder;

    public CitizenService(CitizenRepository repository, IncentiveService incentiveService,
            PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.incentiveService = incentiveService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Citizen createCitizen(String name, String email, String password) {
        Citizen citizen = new Citizen();
        citizen.setFullName(name);
        citizen.setEmail(email);

        // Generate username: from email or name
        String username = (email != null && email.contains("@"))
                ? email.split("@")[0]
                : name.toLowerCase().replaceAll("\\s", "");

        if (repository.findByUsername(username).isPresent()) {
            username += (int) (Math.random() * 999);
        }
        citizen.setUsername(username);

        // Set password: provided or default
        String rawPassword = (password != null && !password.isEmpty()) ? password : "citizen123";
        citizen.setPassword(passwordEncoder.encode(rawPassword));

        citizen.setCurrentScore(750);
        citizen.setRole(Role.CITIZEN);
        Citizen savedCitizen = repository.save(citizen);

        // Evaluate incentives for the new citizen
        incentiveService.evaluateIncentives(savedCitizen);

        return savedCitizen;
    }

    @Transactional
    public Citizen createCitizen(String name) {
        return createCitizen(name, null, null);
    }

    public int getCitizenScore(UUID citizenId) {
        Citizen citizen = repository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return citizen.getCurrentScore();
    }
}
