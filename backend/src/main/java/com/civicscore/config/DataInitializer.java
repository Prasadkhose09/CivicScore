package com.civicscore.config;

import com.civicscore.entity.Incentive;
import com.civicscore.repository.IncentiveRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final IncentiveRepository incentiveRepository;

    public DataInitializer(IncentiveRepository incentiveRepository) {
        this.incentiveRepository = incentiveRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed if no incentives exist
        if (incentiveRepository.count() == 0) {
            System.out.println("Seeding initial incentive data...");

            incentiveRepository.save(createIncentive("Fast-Track Passport Processing",
                    "Priority processing for passport applications", 750));

            incentiveRepository.save(createIncentive("Tax Rebate Benefit",
                    "5% additional tax rebate on income tax", 700));

            incentiveRepository.save(createIncentive("Priority Bank Loan",
                    "Lower interest rates on government bank loans", 650));

            incentiveRepository.save(createIncentive("Government Job Priority",
                    "Priority consideration for government positions", 800));

            incentiveRepository.save(createIncentive("Education Scholarship",
                    "Scholarship eligibility for higher education", 600));

            incentiveRepository.save(createIncentive("Healthcare Discount",
                    "Discounted rates at government hospitals", 500));

            System.out.println("Incentive data seeded successfully!");
        }
    }

    private Incentive createIncentive(String name, String description, int minScore) {
        Incentive incentive = new Incentive();
        incentive.setName(name);
        incentive.setDescription(description);
        incentive.setMinScore(minScore);
        return incentive;
    }
}
