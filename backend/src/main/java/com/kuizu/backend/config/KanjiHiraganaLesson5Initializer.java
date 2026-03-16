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
import org.springframework.core.annotation.Order;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class KanjiHiraganaLesson5Initializer {

    private final UserRepository userRepository;
    private final FlashcardSetRepository flashcardSetRepository;
    private final FlashcardRepository flashcardRepository;

    @Bean
    @Order(5)
    @Profile("!test")
    public CommandLineRunner initKanjiHiraganaLesson5() {
        return args -> {
            if (flashcardSetRepository.findByTitle("Kanji-Higarana bài 5").isPresent()) {
                return;
            }

            User owner = userRepository.findByUsername("student1").orElse(null);
            if (owner == null) return;

            FlashcardSet kanjiSet = FlashcardSet.builder()
                    .owner(owner)
                    .title("Kanji-Higarana bài 5")
                    .description("Luyện đọc Kanji bài 5 bằng Hiragana.")
                    .visibility("PUBLIC")
                    .status("ACTIVE")
                    .isDeleted(false)
                    .version(1)
                    .build();
            
            kanjiSet = flashcardSetRepository.save(kanjiSet);

            List<Flashcard> flashcards = new ArrayList<>();
            
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先生").definition("せんせい").orderIndex(0).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先日").definition("せんじつ").orderIndex(1).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先月").definition("せんげつ").orderIndex(2).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先週").definition("せんしゅう").orderIndex(3).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("週間").definition("しゅうかん").orderIndex(4).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎日").definition("まいにち").orderIndex(5).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎月").definition("まいげつ").orderIndex(6).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎週").definition("まいしゅう").orderIndex(7).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎月").definition("まいつき").orderIndex(8).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎年").definition("まいとし").orderIndex(9).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("午前").definition("ごぜん").orderIndex(10).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("午後").definition("ごご").orderIndex(11).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("前後").definition("ぜんご").orderIndex(12).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("後ろ").definition("うしろ").orderIndex(13).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("後").definition("あと").orderIndex(14).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("見ます").definition("みます").orderIndex(15).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("見学").definition("けんがく").orderIndex(16).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("食べます").definition("たべます").orderIndex(17).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲みます").definition("のみます").orderIndex(18).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲食").definition("いんしょく").orderIndex(19).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲み水").definition("のみみず").orderIndex(20).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("買います").definition("かいます").orderIndex(21).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("買い物します").definition("かいものします").orderIndex(22).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("食べ物").definition("たべもの").orderIndex(23).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("食事します").definition("しょくじします").orderIndex(24).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲み物").definition("のみもの").orderIndex(25).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("人物").definition("じんぶつ").orderIndex(26).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("見物").definition("けんぶつ").orderIndex(27).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("行きます").definition("いきます").orderIndex(28).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("休みの日").definition("やすみのひ").orderIndex(29).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("休日").definition("きゅうじつ").orderIndex(30).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("休みます").definition("やすみます").orderIndex(31).isDeleted(false).build());

            flashcardRepository.saveAll(flashcards);
            System.out.println("=================================================");
            System.out.println("SUCCESS: Kanji-Hiragana Lesson 5 flashcards initialized!");
            System.out.println("Set Title: " + kanjiSet.getTitle());
            System.out.println("Owner: " + owner.getUsername());
            System.out.println("=================================================");
        };
    }
}
