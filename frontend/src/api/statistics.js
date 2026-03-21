import api from './auth';

/**
 * Get paginated user statistics.
 * @param {number} page - Page number (0-indexed).
 * @param {number} size - Number of items per page.
 * @returns {Promise<Object>} - Contains an array of user statistics and pagination info.
 */
export const getUserStatistics = async (page = 0, size = 10) => {
    const response = await api.get('/admin/statistics/users', {
        params: { page, size }
    });
    return response.data;
};

/**
 * Get paginated flashcard set statistics.
 * @param {number} page - Page number (0-indexed).
 * @param {number} size - Number of items per page.
 * @returns {Promise<Object>} - Contains an array of flashcard set statistics and pagination info.
 */
export const getFlashcardSetStatistics = async (page = 0, size = 10) => {
    const response = await api.get('/admin/statistics/flashcards', {
        params: { page, size }
    });
    return response.data;
};
