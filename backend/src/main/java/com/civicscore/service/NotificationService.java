package com.civicscore.service;

import com.civicscore.entity.Citizen;
import com.civicscore.entity.Notification;
import com.civicscore.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Notification sendNotification(Citizen citizen, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setCitizen(citizen);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);

        Notification saved = notificationRepository.save(notification);

        // Send via WebSocket to a user-specific topic
        messagingTemplate.convertAndSend("/topic/notifications/" + citizen.getUsername(), saved);

        return saved;
    }

    public List<Notification> getNotificationsForCitizen(Citizen citizen) {
        return notificationRepository.findByCitizenOrderByCreatedAtDesc(citizen);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public long getUnreadCount(Citizen citizen) {
        return notificationRepository.countByCitizenAndIsReadFalse(citizen);
    }
}
