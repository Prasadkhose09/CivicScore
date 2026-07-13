package com.civicscore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adminUsername;
    private String action; // e.g., "RESOLVE_APPEAL", "ADD_VIOLATION"
    private String targetType; // e.g., "CITIZEN", "APPEAL", "VIOLATION"
    private String targetId;
    private String description;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
