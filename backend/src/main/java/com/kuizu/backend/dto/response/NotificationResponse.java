package com.kuizu.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String notificationId;
    private String title;
    private String content;
    private String type;
    private boolean read;
    private String relatedId;
    private LocalDateTime createdAt;
}
