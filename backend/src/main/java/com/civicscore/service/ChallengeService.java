package com.civicscore.service;

import com.civicscore.entity.*;
import com.civicscore.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final CitizenChallengeRepository citizenChallengeRepository;
    private final CitizenRepository citizenRepository;
    private final ScoreHistoryRepository scoreHistoryRepository;
    private final NotificationService notificationService;

    public ChallengeService(ChallengeRepository challengeRepository,
            CitizenChallengeRepository citizenChallengeRepository,
            CitizenRepository citizenRepository,
            ScoreHistoryRepository scoreHistoryRepository,
            NotificationService notificationService) {
        this.challengeRepository = challengeRepository;
        this.citizenChallengeRepository = citizenChallengeRepository;
        this.citizenRepository = citizenRepository;
        this.scoreHistoryRepository = scoreHistoryRepository;
        this.notificationService = notificationService;
    }

    public List<Challenge> getAvailableChallenges() {
        return challengeRepository.findByIsActiveTrue();
    }

    public List<CitizenChallenge> getCitizenParticipations(UUID citizenId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return citizenChallengeRepository.findByCitizen(citizen);
    }

    @Transactional
    public CitizenChallenge joinChallenge(UUID citizenId, Long challengeId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        if (citizenChallengeRepository.findByCitizenAndChallenge(citizen, challenge).isPresent()) {
            throw new RuntimeException("Already joined this challenge");
        }

        CitizenChallenge participation = new CitizenChallenge();
        participation.setCitizen(citizen);
        participation.setChallenge(challenge);
        participation.setStatus(ChallengeStatus.JOINED);

        return citizenChallengeRepository.save(participation);
    }

    @Transactional
    public CitizenChallenge completeChallenge(UUID citizenId, Long challengeId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        CitizenChallenge participation = citizenChallengeRepository.findByCitizenAndChallenge(citizen, challenge)
                .orElseThrow(() -> new RuntimeException("Challenge participation not found"));

        if (participation.getStatus() == ChallengeStatus.COMPLETED) {
            throw new RuntimeException("Challenge already completed");
        }

        participation.setStatus(ChallengeStatus.COMPLETED);
        participation.setCompletedAt(LocalDateTime.now());

        // Award score
        int oldScore = citizen.getCurrentScore();
        int newScore = Math.min(900, oldScore + challenge.getScoreReward());
        citizen.setCurrentScore(newScore);
        citizenRepository.save(citizen);

        // Score History
        ScoreHistory history = new ScoreHistory();
        history.setCitizen(citizen);
        history.setScoreBefore(oldScore);
        history.setScoreAfter(newScore);
        history.setReason("Completed Challenge: " + challenge.getTitle());
        history.setChangedAt(LocalDateTime.now());
        scoreHistoryRepository.save(history);

        // Notification
        notificationService.sendNotification(
                citizen,
                "Challenge Completed! 🎉",
                "You earned " + challenge.getScoreReward() + " points for completing '" + challenge.getTitle() + "'.",
                "SCORE_CHANGE");

        return citizenChallengeRepository.save(participation);
    }
}
