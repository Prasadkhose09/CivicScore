package com.civicscore.config;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Challenge;
import com.civicscore.entity.Role;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.repository.ChallengeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@Configuration
public class DataLoader implements CommandLineRunner {

    private final CitizenRepository citizenRepository;
    private final ChallengeRepository challengeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(CitizenRepository citizenRepository,
            ChallengeRepository challengeRepository,
            PasswordEncoder passwordEncoder) {
        this.citizenRepository = citizenRepository;
        this.challengeRepository = challengeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            seedData();
            seedChallenges();
        } catch (Exception e) {
            System.err.println("Error during data seeding: " + e.getMessage());
            e.printStackTrace();
            // We don't want to crash the whole application if seeding fails
        }
    }

    private void seedData() {
        // Seed Admin User
        citizenRepository.findByUsername("admin").ifPresentOrElse(
                admin -> {
                    System.out.println("Admin user already exists.");
                },
                () -> {
                    Citizen admin = new Citizen();
                    admin.setUsername("admin");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setFullName("System Administrator");
                    admin.setRole(Role.ADMIN);
                    admin.setCurrentScore(1000);
                    citizenRepository.save(admin);
                    System.out.println("Admin user seeded: admin / admin123");
                });

        // Seed Test Citizen User
        citizenRepository.findByUsername("citizen").ifPresentOrElse(
                existing -> {
                    System.out.println("Test citizen already exists.");
                },
                () -> {
                    // Create new
                    Citizen citizen = new Citizen();
                    citizen.setUsername("citizen");
                    citizen.setPassword(passwordEncoder.encode("citizen123"));
                    citizen.setFullName("Test Citizen");
                    citizen.setRole(Role.CITIZEN);
                    citizen.setCurrentScore(750);
                    try {
                        citizenRepository.save(citizen);
                        System.out.println("New citizen user seeded: citizen / citizen123");
                    } catch (Exception e) {
                        System.err.println("Failed to save new citizen: " + e.getMessage());
                    }
                });
    }

    private void seedChallenges() {
        if (challengeRepository.count() > 0)
            return;

        Challenge c1 = new Challenge();
        c1.setTitle("Park Cleaning Drive");
        c1.setDescription("Join the local community in cleaning the Central Park. Participation earns you 30 points.");
        c1.setScoreReward(30);
        c1.setCategory("ENVIRONMENT");
        challengeRepository.save(c1);

        Challenge c2 = new Challenge();
        c2.setTitle("Blood Donation Camp");
        c2.setDescription("Donate blood at the district hospital. Participation earns you 50 points.");
        c2.setScoreReward(50);
        c2.setCategory("HEALTH");
        challengeRepository.save(c2);

        Challenge c3 = new Challenge();
        c3.setTitle("Traffic Rule Webinar");
        c3.setDescription("Attend a session on traffic safety rules. Participation earns you 15 points.");
        c3.setScoreReward(15);
        c3.setCategory("COMMUNITY");
        challengeRepository.save(c3);

        System.out.println("Sample challenges seeded.");
    }
}
