package com.kuizu.backend.config;

import com.kuizu.backend.entity.Flashcard;
import com.kuizu.backend.entity.FlashcardSet;
import com.kuizu.backend.entity.User;
import com.kuizu.backend.repository.FlashcardRepository;
import com.kuizu.backend.repository.FlashcardSetRepository;
import com.kuizu.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class KanjiLesson6Initializer {

    private final UserRepository userRepository;
    private final FlashcardSetRepository flashcardSetRepository;
    private final FlashcardRepository flashcardRepository;

    @Bean
    @org.springframework.core.annotation.Order(5)
    @Profile("!test")
    public CommandLineRunner initKanjiLesson6() {
        return args -> {
            if (flashcardSetRepository.findByTitle("Kanji bài 6").isPresent()) {
                return;
            }

            User owner = userRepository.findByUsername("student1").orElse(null);
            if (owner == null) return;

            FlashcardSet kanjiSet = FlashcardSet.builder()
                    .owner(owner)
                    .title("Kanji bài 6")
                    .description("Bộ từ vựng Kanji bài 6.")
                    .visibility(com.kuizu.backend.entity.enumeration.Visibility.PUBLIC)
                    .status(com.kuizu.backend.entity.enumeration.ModerationStatus.ACTIVE)
                    .isDeleted(false)
                    .version(1)
                    .build();
            
            kanjiSet = flashcardSetRepository.save(kanjiSet);

            List<Flashcard> flashcards = new ArrayList<>();
            
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("今日 (きょう)").definition("Hôm nay").orderIndex(0).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("今年 (ことし)").definition("Năm nay").orderIndex(1).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("今月 (こんげつ)").definition("Tháng này").orderIndex(2).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("今週 (こんしゅう)").definition("Tuần này").orderIndex(3).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("今 (いま)").definition("Bây giờ").orderIndex(4).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("来週 (らいしゅう)").definition("Tuần tới").orderIndex(5).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("来月 (らいげつ)").definition("Tháng tới").orderIndex(6).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("来年 (らいねん)").definition("Năm tới").orderIndex(7).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("来日 (らいにち)").definition("Đến Nhật Bản").orderIndex(8).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("来ます (きます)").definition("Đến").orderIndex(9).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("帰ります (かえります)").definition("Về").orderIndex(10).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("帰国 (きこく)").definition("Về nước").orderIndex(11).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("会見 (かいけん)").definition("Hội họp").orderIndex(12).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("国会 (こっかい)").definition("Quốc hội").orderIndex(13).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("会います (あいます)").definition("Gặp").orderIndex(14).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("会社 (かいしゃ)").definition("Công ty").orderIndex(15).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("社会 (しゃかい)").definition("Xã hội").orderIndex(16).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("新聞 (しんぶん)").definition("Báo").orderIndex(17).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("聞きます (ききます)").definition("Nghe, hỏi").orderIndex(18).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("読物 (よみもの)").definition("Sách, tạp chí").orderIndex(19).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("読書 (どくしょ)").definition("Đọc sách").orderIndex(20).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("読みます (よみます)").definition("Đọc").orderIndex(21).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("書きます (かきます)").definition("Viết").orderIndex(22).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("書き物 (かきもの)").definition("Bút, phấn").orderIndex(23).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("話 (はなし)").definition("Câu chuyện").orderIndex(24).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("会話 (かいわ)").definition("Hội thoại").orderIndex(25).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("話します (はなします)").definition("Nói").orderIndex(26).isDeleted(false).build());

            flashcardRepository.saveAll(flashcards);
            System.out.println("=================================================");
            System.out.println("SUCCESS: Kanji Lesson 6 flashcards initialized!");
            System.out.println("Set Title: " + kanjiSet.getTitle());
            System.out.println("Owner: " + owner.getUsername());
            System.out.println("=================================================");
        };
    }
}
