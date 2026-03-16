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
public class KanjiLesson5Initializer {

    private final UserRepository userRepository;
    private final FlashcardSetRepository flashcardSetRepository;
    private final FlashcardRepository flashcardRepository;

    @Bean
    @org.springframework.core.annotation.Order(4)
    @Profile("!test")
    public CommandLineRunner initKanjiLesson5() {
        return args -> {
            if (flashcardSetRepository.findByTitle("Kanji bài 5").isPresent()) {
                return;
            }

            User owner = userRepository.findByUsername("student1").orElse(null);
            if (owner == null) return;

            FlashcardSet kanjiSet = FlashcardSet.builder()
                    .owner(owner)
                    .title("Kanji bài 5")
                    .description("Bộ từ vựng Kanji bài 5.")
                    .visibility("PUBLIC")
                    .status("ACTIVE")
                    .isDeleted(false)
                    .version(1)
                    .build();
            
            kanjiSet = flashcardSetRepository.save(kanjiSet);

            List<Flashcard> flashcards = new ArrayList<>();
            
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先生 (せんせい)").definition("Thầy/cô").orderIndex(0).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先日 (ぜんじつ)").definition("Mấy ngày trước").orderIndex(1).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先月 (せんげつ)").definition("Tháng trước").orderIndex(2).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("先週 (せんしゅう)").definition("Tuần trước").orderIndex(3).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("週間 (しゅうかん)").definition("~ tuần (số lượng)").orderIndex(4).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎日 (まいにち)").definition("Mỗi ngày").orderIndex(5).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎月 (まいげつ)").definition("Mỗi tháng (maigetsu)").orderIndex(6).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎週 (まいしゅう)").definition("Mỗi tuần").orderIndex(7).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎月 (まいつき)").definition("Mỗi tháng (maitsuki)").orderIndex(8).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("毎年 (まいとし)").definition("Mỗi năm").orderIndex(9).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("午前 (ごぜん)").definition("Buổi sáng, AM").orderIndex(10).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("午後 (ごご)").definition("Buổi chiều, PM").orderIndex(11).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("前後 (ぜんご)").definition("Trước sau").orderIndex(12).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("後ろ (うしろ)").definition("Phía sau").orderIndex(13).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("後 (あと)").definition("Sau đó").orderIndex(14).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("見ます (みます)").definition("Xem").orderIndex(15).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("見学 (けんがく)").definition("Kiến tập").orderIndex(16).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("食べます (たべます)").definition("Ăn").orderIndex(17).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲みます (のみます)").definition("Uống").orderIndex(18).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲食 (いんしょく)").definition("Ẩm thực").orderIndex(19).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲み水 (のみみず)").definition("Nước uống").orderIndex(20).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("買います (かいます)").definition("Mua").orderIndex(21).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("買い物します (かいものします)").definition("Mua sắm").orderIndex(22).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("食べ物 (たべもの)").definition("Đồ ăn").orderIndex(23).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("食事します (しょくじします)").definition("Dùng bữa").orderIndex(24).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("飲み物 (のみもの)").definition("Đồ uống").orderIndex(25).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("人物 (じんぶつ)").definition("Nhân vật").orderIndex(26).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("見物 (けんぶつ)").definition("Ngắm cảnh").orderIndex(27).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("行きます (いきます)").definition("Đi").orderIndex(28).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("休みの日 (やすみのひ)").definition("Ngày nghỉ").orderIndex(29).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("休日 (きゅうじつ)").definition("Ngày nghỉ").orderIndex(30).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("休みます (やすみます)").definition("Nghỉ (giải lao)").orderIndex(31).isDeleted(false).build());

            flashcardRepository.saveAll(flashcards);
            System.out.println("=================================================");
            System.out.println("SUCCESS: Kanji Lesson 5 flashcards initialized!");
            System.out.println("Set Title: " + kanjiSet.getTitle());
            System.out.println("Owner: " + owner.getUsername());
            System.out.println("=================================================");
        };
    }
}
