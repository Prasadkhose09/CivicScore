package com.civicscore.controller;

import com.civicscore.dto.DashboardStatsDTO;
import com.civicscore.entity.AppealStatus;
import com.civicscore.repository.AppealRepository;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.repository.ViolationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {

    private final CitizenRepository citizenRepository;
    private final AppealRepository appealRepository;
    private final ViolationRepository violationRepository;

    public DashboardController(CitizenRepository citizenRepository,
            AppealRepository appealRepository,
            ViolationRepository violationRepository) {
        this.citizenRepository = citizenRepository;
        this.appealRepository = appealRepository;
        this.violationRepository = violationRepository;
    }

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        long totalCitizens = citizenRepository.count();
        long pendingAppeals = appealRepository.countByStatus(AppealStatus.PENDING);

        // Violations from start of today
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        long violationsToday = violationRepository.countByViolationTimeAfter(startOfToday);

        Double avgScore = violationRepository.findAverageScore();
        double averageScore = avgScore != null ? avgScore : 750.0;

        return new DashboardStatsDTO(totalCitizens, pendingAppeals, violationsToday, averageScore);
    }
}
