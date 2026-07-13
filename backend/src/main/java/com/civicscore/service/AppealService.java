package com.civicscore.service;

import com.civicscore.entity.*;
import com.civicscore.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@org.springframework.transaction.annotation.Transactional
public class AppealService {

    private final AppealRepository appealRepository;
    private final ViolationRepository violationRepository;
    private final CitizenRepository citizenRepository;
    private final ScoreHistoryRepository scoreHistoryRepository;
    private final IncentiveService incentiveService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AppealService(AppealRepository appealRepository,
            ViolationRepository violationRepository,
            CitizenRepository citizenRepository,
            ScoreHistoryRepository scoreHistoryRepository,
            IncentiveService incentiveService,
            NotificationService notificationService,
            AuditLogService auditLogService) {
        this.appealRepository = appealRepository;
        this.violationRepository = violationRepository;
        this.citizenRepository = citizenRepository;
        this.scoreHistoryRepository = scoreHistoryRepository;
        this.incentiveService = incentiveService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    // Citizen raises appeal
    public Appeal raiseAppeal(Long violationId, String reason) {

        Violation violation = violationRepository.findById(violationId)
                .orElseThrow(() -> new RuntimeException("Violation not found"));

        Appeal appeal = new Appeal();
        appeal.setViolation(violation);
        appeal.setCitizen(violation.getCitizen());
        appeal.setReason(reason);
        appeal.setStatus(AppealStatus.PENDING);
        appeal.setCreatedAt(LocalDateTime.now());

        return appealRepository.save(appeal);
    }

    // Authority resolves appeal
    public Appeal resolveAppeal(Long appealId, AppealStatus status) {

        Appeal appeal = appealRepository.findById(appealId)
                .orElseThrow(() -> new RuntimeException("Appeal not found"));

        if (appeal.getStatus() != AppealStatus.PENDING) {
            throw new RuntimeException("Appeal already resolved");
        }

        appeal.setStatus(status);

        if (status == AppealStatus.APPROVED) {
            restoreScore(appeal);
        }

        // Notify citizen
        notificationService.sendNotification(
                appeal.getCitizen(),
                "Appeal Resolved",
                "Your appeal for '" + appeal.getViolation().getDescription() + "' has been "
                        + status.toString().toLowerCase() + ".",
                "APPEAL_UPDATE");

        // Log admin action
        auditLogService.log(
                null,
                "RESOLVE_APPEAL",
                "APPEAL",
                appealId.toString(),
                "Resolved appeal with status: " + status);

        return appealRepository.save(appeal);
    }

    private void restoreScore(Appeal appeal) {

        Citizen citizen = appeal.getCitizen();
        Violation violation = appeal.getViolation();

        int restoredScore = switch (violation.getSeverity()) {
            case MINOR -> 5;
            case MAJOR -> 20;
            case CRITICAL -> 50;
        };

        int oldScore = citizen.getCurrentScore();
        int newScore = Math.min(900, oldScore + restoredScore);

        citizen.setCurrentScore(newScore);
        citizenRepository.save(citizen);
        incentiveService.evaluateIncentives(citizen);

        // Audit trail
        ScoreHistory history = new ScoreHistory();
        history.setCitizen(citizen);
        history.setScoreBefore(oldScore);
        history.setScoreAfter(newScore);
        history.setReason("Appeal approved for violation: " + violation.getDescription());
        history.setChangedAt(LocalDateTime.now());

        scoreHistoryRepository.save(history);
    }
}
