package com.civicscore.entity;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appealId;

    @ManyToOne
    @JoinColumn(name = "citizenId", nullable = false)
    private Citizen citizen;

    @ManyToOne
    @JoinColumn(name = "violation_id", nullable = false)
    private Violation violation;

    private String reason;




    @Enumerated(EnumType.STRING)
    private AppealStatus status;

    private LocalDateTime createdAt;


}
