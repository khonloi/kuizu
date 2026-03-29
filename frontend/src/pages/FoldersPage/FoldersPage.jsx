import React from 'react';
import ContentListPage from '../shared/ContentListPage';
import { getPublicFolders, getMyFolders, deleteFolder } from '@/api/folder';
import { useModal } from '@/context/ModalContext';

const FoldersPage = () => {
    const { openFolderModal } = useModal();

    return (
        <ContentListPage
            type="folders"
            fetchPublic={getPublicFolders}
            fetchMy={getMyFolders}
            deleteItem={deleteFolder}
            openModal={openFolderModal}
            title="Folders"
            createLabel="Create Folder"
            searchPlaceholder="Search folders..."
            emptyMsg="No folders found."
            itemLabel="Sets"
            navigatePath="/folders"
        />
    );
};

export default FoldersPage;
