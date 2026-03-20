package com.kuizu.backend.repository;

import com.kuizu.backend.entity.Notification;
import com.kuizu.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
    List<Notification> findByRecipientAndReadFalseOrderByCreatedAtDesc(User recipient);
    long countByRecipientAndReadFalse(User recipient);
}
