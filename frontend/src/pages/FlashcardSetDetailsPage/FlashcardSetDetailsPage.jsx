import { useParams } from 'react-router-dom';
import ContentDetailsPage from '../shared/ContentDetailsPage';
import { getFlashcardSetById, getFlashcardsBySetId, deleteFlashcard } from '@/api/flashcards';
import { useModal } from '@/context/ModalContext';

const FlashcardSetDetailsPage = () => {
    const { setId } = useParams();
    const { openSetModal, openCardModal } = useModal();

    return (
        <ContentDetailsPage
            id={setId}
            type="sets"
            getById={getFlashcardSetById}
            getChildren={getFlashcardsBySetId}
            deleteChild={(setId, cardId) => deleteFlashcard(cardId)}
            openEditModal={openSetModal}
            openAddChildModal={(setId, callback) => openCardModal(setId, null, callback)}
            openEditChildModal={(setId, cardId, callback) => openCardModal(setId, cardId, callback)}
            backPath="/flashcard-sets"
        />
    );
};

export default FlashcardSetDetailsPage;
