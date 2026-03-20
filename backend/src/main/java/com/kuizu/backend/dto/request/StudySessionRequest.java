package com.kuizu.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionRequest {
    private Long cardId;
    private Boolean isCorrect;
}
