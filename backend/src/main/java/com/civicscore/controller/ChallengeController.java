package com.civicscore.controller;

import com.civicscore.entity.Challenge;
import com.civicscore.entity.CitizenChallenge;
import com.civicscore.service.ChallengeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public List<Challenge> getAvailableChallenges() {
        return challengeService.getAvailableChallenges();
    }

    @GetMapping("/my/{citizenId}")
    public List<CitizenChallenge> getMyChallenges(@PathVariable UUID citizenId) {
        return challengeService.getCitizenParticipations(citizenId);
    }

    @PostMapping("/{challengeId}/join/{citizenId}")
    public CitizenChallenge joinChallenge(@PathVariable Long challengeId, @PathVariable UUID citizenId) {
        return challengeService.joinChallenge(citizenId, challengeId);
    }

    @PostMapping("/{challengeId}/complete/{citizenId}")
    public CitizenChallenge completeChallenge(@PathVariable Long challengeId, @PathVariable UUID citizenId) {
        return challengeService.completeChallenge(citizenId, challengeId);
    }
}
