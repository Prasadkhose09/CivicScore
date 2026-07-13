package com.civicscore.controller;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Notification;
import com.civicscore.repository.CitizenRepository;
import com.civicscore.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final CitizenRepository citizenRepository;

    public NotificationController(NotificationService notificationService, CitizenRepository citizenRepository) {
        this.notificationService = notificationService;
        this.citizenRepository = citizenRepository;
    }

    @GetMapping("/{citizenId}")
    public List<Notification> getNotifications(@PathVariable UUID citizenId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return notificationService.getNotificationsForCitizen(citizen);
    }

    @GetMapping("/{citizenId}/unread-count")
    public long getUnreadCount(@PathVariable UUID citizenId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        return notificationService.getUnreadCount(citizen);
    }

    @PostMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
    }
}
