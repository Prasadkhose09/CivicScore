package com.civicscore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    private long totalCitizens;
    private long pendingAppeals;
    private long violationsToday;
    private double averageScore;
}
