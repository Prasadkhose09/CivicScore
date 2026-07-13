package com.civicscore.repository;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByCitizenOrderByCreatedAtDesc(Citizen citizen);

    long countByCitizenAndIsReadFalse(Citizen citizen);
}
