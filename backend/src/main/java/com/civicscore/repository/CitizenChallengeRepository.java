package com.civicscore.repository;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Challenge;
import com.civicscore.entity.CitizenChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CitizenChallengeRepository extends JpaRepository<CitizenChallenge, Long> {
    List<CitizenChallenge> findByCitizen(Citizen citizen);

    Optional<CitizenChallenge> findByCitizenAndChallenge(Citizen citizen, Challenge challenge);
}
