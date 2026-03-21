package com.kuizu.backend.service;

import com.kuizu.backend.dto.response.FlashcardSetStatisticResponse;
import com.kuizu.backend.dto.response.UserStatisticResponse;
import com.kuizu.backend.entity.FlashcardSetStatistic;
import com.kuizu.backend.entity.UserStatistic;
import com.kuizu.backend.repository.FlashcardSetStatisticRepository;
import com.kuizu.backend.repository.UserStatisticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final UserStatisticRepository userStatisticRepository;
    private final FlashcardSetStatisticRepository flashcardSetStatisticRepository;
    private final jakarta.persistence.EntityManager entityManager;

    @Transactional(readOnly = true)
    public Page<UserStatisticResponse> getUserStatistics(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "lastActiveAt"));
        Page<UserStatistic> statistics = userStatisticRepository.findAll(pageable);

        return statistics.map(stat -> {
            var user = stat.getUser();
            return UserStatisticResponse.builder()
                    .userId(stat.getUserId())
                    .username(user != null ? user.getUsername() : null)
                    .displayName(user != null ? user.getDisplayName() : null)
                    .email(user != null ? user.getEmail() : null)
                    .profilePictureUrl(user != null ? user.getProfilePictureUrl() : null)
                    .totalSets(stat.getTotalSets())
                    .totalCards(stat.getTotalCards())
                    .quizzesTaken(stat.getQuizzesTaken())
                    .avgScore(stat.getAvgScore())
                    .lastActiveAt(stat.getLastActiveAt())
                    .createdAt(stat.getCreatedAt())
                    .build();
        });
    }

    @Transactional(readOnly = true)
    public Page<FlashcardSetStatisticResponse> getFlashcardSetStatistics(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "viewCount"));
        Page<FlashcardSetStatistic> statistics = flashcardSetStatisticRepository.findAll(pageable);

        return statistics.map(stat -> {
            var set = stat.getFlashcardSet();
            var owner = set != null ? set.getOwner() : null;
            return FlashcardSetStatisticResponse.builder()
                    .setId(stat.getSetId())
                    .title(set != null ? set.getTitle() : null)
                    .ownerUsername(owner != null ? owner.getUsername() : null)
                    .ownerDisplayName(owner != null ? owner.getDisplayName() : null)
                    .viewCount(stat.getViewCount())
                    .quizCount(stat.getQuizCount())
                    .retentionRate(stat.getRetentionRate())
                    .lastViewedAt(stat.getLastViewedAt())
                    .build();
        });
    }

    // --- UserStatistic Updater Methods ---

    @Transactional
    public UserStatistic getOrCreateUserStatistic(com.kuizu.backend.entity.User user) {
        return userStatisticRepository.findById(user.getUserId())
                .orElseGet(() -> {
                    UserStatistic newStat = UserStatistic.builder()
                            .user(user)
                            .userId(user.getUserId())
                            .totalSets(0L)
                            .totalCards(0L)
                            .quizzesTaken(0L)
                            .avgScore(java.math.BigDecimal.ZERO)
                            .lastActiveAt(java.time.LocalDateTime.now())
                            .build();
                    entityManager.persist(newStat);
                    return newStat;
                });
    }

    @Transactional
    public void updateUserActivity(com.kuizu.backend.entity.User user) {
        UserStatistic stat = getOrCreateUserStatistic(user);
        stat.setLastActiveAt(java.time.LocalDateTime.now());
        userStatisticRepository.save(stat);
    }

    @Transactional
    public void incrementUserTotalSets(com.kuizu.backend.entity.User user) {
        UserStatistic stat = getOrCreateUserStatistic(user);
        stat.setTotalSets(stat.getTotalSets() + 1);
        stat.setLastActiveAt(java.time.LocalDateTime.now());
        userStatisticRepository.save(stat);
    }

    @Transactional
    public void incrementUserTotalCards(com.kuizu.backend.entity.User user, int count) {
        UserStatistic stat = getOrCreateUserStatistic(user);
        stat.setTotalCards(stat.getTotalCards() + count);
        stat.setLastActiveAt(java.time.LocalDateTime.now());
        userStatisticRepository.save(stat);
    }

    @Transactional
    public void updateUserQuizStats(com.kuizu.backend.entity.User user, java.math.BigDecimal latestScore) {
        UserStatistic stat = getOrCreateUserStatistic(user);
        
        long previousQuizzes = stat.getQuizzesTaken() != null ? stat.getQuizzesTaken() : 0L;
        java.math.BigDecimal previousAvg = stat.getAvgScore() != null ? stat.getAvgScore() : java.math.BigDecimal.ZERO;
        
        long newQuizzes = previousQuizzes + 1;
        
        // new avg = ((prev_avg * prev_quizzes) + latestScore) / new_quizzes
        java.math.BigDecimal newAvg = previousAvg.multiply(java.math.BigDecimal.valueOf(previousQuizzes))
                .add(latestScore)
                .divide(java.math.BigDecimal.valueOf(newQuizzes), 2, java.math.RoundingMode.HALF_UP);
                
        stat.setQuizzesTaken(newQuizzes);
        stat.setAvgScore(newAvg);
        stat.setLastActiveAt(java.time.LocalDateTime.now());
        userStatisticRepository.save(stat);
    }

    // --- FlashcardSetStatistic Updater Methods ---

    @Transactional
    public FlashcardSetStatistic getOrCreateFlashcardSetStatistic(com.kuizu.backend.entity.FlashcardSet set) {
        return flashcardSetStatisticRepository.findById(set.getSetId())
                .orElseGet(() -> {
                    FlashcardSetStatistic newStat = FlashcardSetStatistic.builder()
                            .flashcardSet(set)
                            .setId(set.getSetId())
                            .viewCount(0L)
                            .quizCount(0L)
                            .retentionRate(java.math.BigDecimal.ZERO)
                            .lastViewedAt(java.time.LocalDateTime.now())
                            .build();
                    entityManager.persist(newStat);
                    return newStat;
                });
    }

    @Transactional
    public void incrementSetViewCount(com.kuizu.backend.entity.FlashcardSet set) {
        FlashcardSetStatistic stat = getOrCreateFlashcardSetStatistic(set);
        stat.setViewCount(stat.getViewCount() + 1);
        stat.setLastViewedAt(java.time.LocalDateTime.now());
        flashcardSetStatisticRepository.save(stat);
    }

    @Transactional
    public void updateSetQuizStats(com.kuizu.backend.entity.FlashcardSet set, java.math.BigDecimal score) {
        FlashcardSetStatistic stat = getOrCreateFlashcardSetStatistic(set);
        
        long previousQuizzes = stat.getQuizCount() != null ? stat.getQuizCount() : 0L;
        java.math.BigDecimal previousRetention = stat.getRetentionRate() != null ? stat.getRetentionRate() : java.math.BigDecimal.ZERO;
        
        long newQuizzes = previousQuizzes + 1;
        
        java.math.BigDecimal newRetention = previousRetention.multiply(java.math.BigDecimal.valueOf(previousQuizzes))
                .add(score)
                .divide(java.math.BigDecimal.valueOf(newQuizzes), 2, java.math.RoundingMode.HALF_UP);
                
        stat.setQuizCount(newQuizzes);
        stat.setRetentionRate(newRetention);
        // Only update view count if viewed in detail? Quiz implies viewing
        stat.setLastViewedAt(java.time.LocalDateTime.now());
        flashcardSetStatisticRepository.save(stat);
    }
}
