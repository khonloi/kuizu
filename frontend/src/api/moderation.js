import api from "./auth";
import { getAllUsers as _getAllUsers, updateUserStatus } from './user';

export const getPendingFlashcardSets = async () => {
  const response = await api.get("/moderation/submissions/flashcards");
  return response.data;
};

export const getPendingClasses = async () => {
  const response = await api.get("/moderation/submissions/classes");
  return response.data;
};

export const getModerationHistory = async () => {
    const response = await api.get("/moderation/history");
    return response.data;
};

export const approveFlashcardSet = async (setId, notes = "") => {
    const response = await api.post(`/moderation/flashcards/${setId}/approve`, { notes });
    return response.data;
};

export const rejectFlashcardSet = async (setId, notes = "") => {
    const response = await api.post(`/moderation/flashcards/${setId}/reject`, { notes });
    return response.data;
};

export const approveClass = async (classId, notes = "") => {
    const response = await api.post(`/moderation/classes/${classId}/approve`, { notes });
    return response.data;
};

export const rejectClass = async (classId, notes = "") => {
    const response = await api.post(`/moderation/classes/${classId}/reject`, { notes });
    return response.data;
};

export const getPendingSets = getPendingFlashcardSets;

export const getAllUsers = async () => {
    const data = await _getAllUsers(0, 500);
    return data.content || data;
};

export const getPendingCount = async () => {
    try {
        const [sets, classes] = await Promise.all([getPendingSets(), getPendingClasses()]);
        return (sets?.length || 0) + (classes?.length || 0);
    } catch {
        return 0;
    }
};

export const processModeration = async ({ entityType, entityId, action, notes }) => {
    const actionLower = action.toLowerCase();
    if (entityType === 'SET') {
        const response = await api.post(`/moderation/flashcards/${entityId}/${actionLower}`, { notes });
        return response.data;
    } else if (entityType === 'CLASS') {
        const response = await api.post(`/moderation/classes/${entityId}/${actionLower}`, { notes });
        return response.data;
    } else if (entityType === 'USER') {
        const status = action === 'ACTIVATE' ? 'ACTIVE' : 'SUSPENDED';
        return await updateUserStatus(entityId, status);
    }
};
