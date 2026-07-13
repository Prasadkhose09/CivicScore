package com.civicscore.entity;


import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter@AllArgsConstructor@NoArgsConstructor
public class CitizenIncentiveStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "citizenId",nullable = false)
    private Citizen citizen;

    @ManyToOne
    @JoinColumn(name = "incentive_Id", nullable = false)
    private Incentive incentive;

    private boolean eligible;
}
