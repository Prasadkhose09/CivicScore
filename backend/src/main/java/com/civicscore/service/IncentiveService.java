package com.civicscore.service;


import com.civicscore.entity.Citizen;
import com.civicscore.entity.CitizenIncentiveStatus;
import com.civicscore.entity.Incentive;
import com.civicscore.repository.CitizenIncentiveStatusRepository;
import com.civicscore.repository.IncentiveRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncentiveService {

    private final IncentiveRepository incentiveRepository;
    private final CitizenIncentiveStatusRepository statusRepository;

    public IncentiveService(IncentiveRepository incentiveRepository, CitizenIncentiveStatusRepository statusRepository) {
        this.incentiveRepository = incentiveRepository;
        this.statusRepository = statusRepository;
    }

    public void evaluateIncentives(Citizen citizen){
        List<Incentive> incentives = incentiveRepository.findAll();

        for(Incentive incentive: incentives){

            boolean eligible = citizen.getCurrentScore() >= incentive.getMinScore();

            CitizenIncentiveStatus status =
                    statusRepository.findByCitizen(citizen)
                            .stream()
                            .filter(s -> s.getIncentive().getIncentiveId()
                                    .equals((incentive.getIncentiveId())))
                            .findFirst()
                            .orElseGet(() ->{
                                CitizenIncentiveStatus newStatus =
                                        new CitizenIncentiveStatus();
                                newStatus.setCitizen(citizen);
                                newStatus.setIncentive(incentive);
                                return newStatus;
                            });

            status.setEligible(eligible);
            statusRepository.save(status);
        }


    }
}
