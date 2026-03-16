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
public class KanjiLesson7Initializer {

    private final UserRepository userRepository;
    private final FlashcardSetRepository flashcardSetRepository;
    private final FlashcardRepository flashcardRepository;

    @Bean
    @org.springframework.core.annotation.Order(6)
    @Profile("!test")
    public CommandLineRunner initKanjiLesson7() {
        return args -> {
            if (flashcardSetRepository.findByTitle("Kanji bài 7").isPresent()) {
                return;
            }

            User owner = userRepository.findByUsername("student1").orElse(null);
            if (owner == null) return;

            FlashcardSet kanjiSet = FlashcardSet.builder()
                    .owner(owner)
                    .title("Kanji bài 7")
                    .description("Bộ từ vựng Kanji bài 7.")
                    .visibility("PUBLIC")
                    .status("ACTIVE")
                    .isDeleted(false)
                    .version(1)
                    .build();
            
            kanjiSet = flashcardSetRepository.save(kanjiSet);

            List<Flashcard> flashcards = new ArrayList<>();
            
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("お寺 (おてら)").definition("Chùa").orderIndex(0).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("言語 (げんご)").definition("Ngôn ngữ").orderIndex(1).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("言います (いいます)").definition("Nói").orderIndex(2).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("貝 (かい)").definition("Sò, ốc").orderIndex(3).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("水田 (すいでん)").definition("Ruộng lúa nước").orderIndex(4).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("田中さん (たなかさん)").definition("Anh Tanaka").orderIndex(5).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("水力 (すいりょく)").definition("Thủy lực").orderIndex(6).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("火力 (かりょく)").definition("Hỏa lực").orderIndex(7).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("力 (ちから)").definition("Sức lực").orderIndex(8).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("大学の門 (だいがくのもん)").definition("Cổng trường đại học").orderIndex(9).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("肉 (にく)").definition("Thịt").orderIndex(10).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("料金 (りょうきん)").definition("Tiền phí").orderIndex(11).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("料理 (りょうり)").definition("Món ăn").orderIndex(12).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("野菜 (やさい)").definition("Rau").orderIndex(13).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("野 (の)").definition("Cánh đồng").orderIndex(14).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("半ば (なかば)").definition("Giữa").orderIndex(15).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("半年 (はんとし)").definition("Nửa năm").orderIndex(16).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("半月 (はんつき)").definition("Nửa tháng").orderIndex(17).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("半日 (はんにち)").definition("Nửa ngày").orderIndex(18).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("半分 (はんぶん)").definition("Một nửa").orderIndex(19).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("七時半 (しちじはん)").definition("7h30").orderIndex(20).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("大きい (おおきい)").definition("To, lớn").orderIndex(21).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("大学生 (だいがくせい)").definition("Sinh viên đại học").orderIndex(22).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("大人 (おとな)").definition("Người lớn").orderIndex(23).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("大会 (たいかい)").definition("Đại hội").orderIndex(24).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("大半 (たいはん)").definition("Phần lớn").orderIndex(25).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("小さい (ちいさい)").definition("Bé, nhỏ").orderIndex(26).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("小人 (こびと)").definition("Người nhỏ con").orderIndex(27).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("小学校 (しょうがっこう)").definition("Trường tiểu học").orderIndex(28).isDeleted(false).build());
            flashcards.add(Flashcard.builder().flashcardSet(kanjiSet).term("小学生 (しょうがくせい)").definition("Học sinh tiểu học").orderIndex(29).isDeleted(false).build());

            flashcardRepository.saveAll(flashcards);
            System.out.println("=================================================");
            System.out.println("SUCCESS: Kanji Lesson 7 flashcards initialized!");
            System.out.println("Set Title: " + kanjiSet.getTitle());
            System.out.println("Owner: " + owner.getUsername());
            System.out.println("=================================================");
        };
    }
}
