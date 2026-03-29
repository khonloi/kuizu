import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentDetailsPage from '../shared/ContentDetailsPage';
import { getFolderDetail, removeSetFromFolder } from '@/api/folder';
import { useModal } from '@/context/ModalContext';
import AddSetToFolderModal from '../../components/Folder/AddSetToFolderModal';
import AddCategoryModal from '../../components/Folder/AddCategoryModal';
import { useToast } from '@/context/ToastContext';

const FolderDetailPage = () => {
    const { folderId } = useParams();
    const { openFolderModal } = useModal();
    const { success, error } = useToast();
    const [isAddSetOpen, setIsAddSetOpen] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

    return (
        <>
            <ContentDetailsPage
                key={refreshTrigger}
                id={folderId}
                type="folders"
                getById={getFolderDetail}
                deleteChild={(folderId, setId) => removeSetFromFolder(folderId, setId)}
                openEditModal={openFolderModal}
                openAddChildModal={() => setIsAddSetOpen(true)}
                backPath="/folders"
            />
            
            <AddSetToFolderModal
                isOpen={isAddSetOpen}
                onClose={() => setIsAddSetOpen(false)}
                folderId={folderId}
                onSetAdded={handleRefresh}
            />

            <AddCategoryModal 
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                folderId={folderId}
                onCategoryAdded={handleRefresh}
            />
        </>
    );
};

export default FolderDetailPage;
