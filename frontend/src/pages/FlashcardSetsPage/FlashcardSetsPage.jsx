import React from 'react';
import ContentListPage from '../shared/ContentListPage';
import { getPublicFlashcardSets, getMyFlashcardSets, deleteFlashcardSet } from '@/api/flashcards';
import { useModal } from '@/context/ModalContext';

const FlashcardSetsPage = () => {
    const { openSetModal } = useModal();

    return (
        <ContentListPage
            type="sets"
            fetchPublic={getPublicFlashcardSets}
            fetchMy={getMyFlashcardSets}
            deleteItem={deleteFlashcardSet}
            openModal={openSetModal}
            title="Flashcard Sets"
            createLabel="Create Set"
            searchPlaceholder="Search sets..."
            emptyMsg="No flashcard sets found."
            itemLabel="terms"
            navigatePath="/flashcard-sets"
        />
    );
};

export default FlashcardSetsPage;
