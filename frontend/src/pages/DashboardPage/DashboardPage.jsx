import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyClasses } from '@/api/class';
import { getMyFolders, getPublicFolders } from '@/api/folder';
import { getMyFlashcardSets, getFlashcardSetById, getPublicFlashcardSets } from '@/api/flashcards';
import CreateClassModal from '@/components/Class/CreateClassModal';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { FolderOpen, Globe, BookOpen } from 'lucide-react';
import { Button, Card, Loader, EmptyState } from '@/components/ui';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const { openSetModal, openFolderModal } = useModal();
    const [classes, setClasses] = useState([]);
    const [folders, setFolders] = useState([]);
    const [publicFolders, setPublicFolders] = useState([]);
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [publicFlashcardSets, setPublicFlashcardSets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
    const navigate = useNavigate();

    const isTeacherOrAdmin = user?.role === 'ROLE_TEACHER' || user?.role === 'ROLE_ADMIN';

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const [classData, folderData, pubFolderData, mySetsData, publicSetsData] = await Promise.all([
                getMyClasses(),
                getMyFolders(),
                getPublicFolders(),
                getMyFlashcardSets(),
                getPublicFlashcardSets()
            ]);

            // Get recent sets from localStorage
            const recentIds = JSON.parse(localStorage.getItem('recent_sets') || '[]');
            let recentSets = [];

            if (recentIds.length > 0) {
                // Fetch the content of these sets
                // To avoid too many calls, we check if they are already in mySetsData
                const results = await Promise.allSettled(
                    recentIds.map(id => {
                        const existing = mySetsData.find(s => String(s.setId) === String(id));
                        if (existing) return Promise.resolve(existing);
                        return getFlashcardSetById(id);
                    })
                );
                recentSets = results
                    .filter(r => r.status === 'fulfilled')
                    .map(r => r.value);
            }

            // Use history if available, otherwise fallback to my sets
            const displaySets = recentSets.length > 0 ? recentSets : mySetsData;

            setClasses(classData);
            setFolders(folderData);
            setPublicFolders(pubFolderData);
            setFlashcardSets(displaySets);
            setPublicFlashcardSets(publicSetsData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleClassClick = (classId) => {
        navigate(`/classes/${classId}`);
    };

    const handleClassCreated = (newClass) => {
        setClasses(prev => [newClass, ...prev]);
        setIsCreateClassOpen(false);
    };

    const handleFolderCreated = (newFolder) => {
        setFolders(prev => [newFolder, ...prev]);
    };

    const handleNewFolderClick = () => {
        openFolderModal(null, handleFolderCreated);
    };

    const handleNewSetClick = () => {
        openSetModal(null, (newSet) => {
            setFlashcardSets(prev => [newSet, ...prev]);
        });
    };

    const triggerComingSoon = (feature = '') => {
        const query = feature ? `?feature=${encodeURIComponent(feature)}` : '';
        navigate(`/coming-soon${query}`);
    };

    if (isLoading) {
        return <Loader fullPage={true} />;
    }

    return (
        <div className="dashboard-container">
            {/* Flashcard Sets Section */}
            <section className="dashboard-section">
                <div className="dashboard-section-header">
                    <h2>Recent Flashcard Sets</h2>
                    <div className="section-actions">
                        <Button variant="outline" size="sm" onClick={handleNewSetClick}>New Flashcard Set</Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/flashcard-sets')}>View all</Button>
                    </div>
                </div>

                {flashcardSets.length > 0 ? (
                    <div className="dashboard-grid">
                        {flashcardSets.slice(0, 4).map(set => (
                            <Card
                                key={set.id || set.setId}
                                onClick={() => navigate(`/flashcard-sets/${set.id || set.setId}`)}
                                title={set.title}
                                badge={`${set.cardCount || 0} terms`}
                                description={set.description}
                                ownerName={set.ownerDisplayName}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={BookOpen}
                        title="No sets yet"
                        description="Start creating your first set to begin studying!"
                        action={<Button variant="primary" onClick={handleNewSetClick}>Create Flashcard Set</Button>}
                    />
                )}
            </section>

            {/* Suggested Flashcard Sets */}
            {publicFlashcardSets.length > 0 && (
                <section className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h2>
                            Suggested Flashcard Sets
                        </h2>
                        <div className="section-actions">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/flashcard-sets')}>View all</Button>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {publicFlashcardSets.slice(0, 4).map(set => (
                            <Card
                                key={set.id || set.setId}
                                onClick={() => navigate(`/flashcard-sets/${set.id || set.setId}`)}
                                title={set.title}
                                badge={`${set.cardCount || 0} terms`}
                                description={set.description}
                                ownerName={set.ownerDisplayName}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Folders Section */}
            <section className="dashboard-section">
                <div className="dashboard-section-header">
                    <h2>My Folders</h2>
                    <div className="section-actions">
                        <Button variant="outline" size="sm" onClick={handleNewFolderClick}>New Folder</Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/folders')}>View all</Button>
                    </div>
                </div>

                {folders.length > 0 ? (
                    <div className="dashboard-grid">
                        {folders.map(folder => (
                            <Card
                                key={folder.id || folder.folderId}
                                onClick={() => navigate(`/folders/${folder.id || folder.folderId}`)}
                                title={folder.name}
                                badge={`${folder.setCount} sets`}
                                description={folder.description}
                                ownerName={folder.ownerDisplayName}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={FolderOpen}
                        title="No folders yet"
                        description="Organize your sets into folders for better study flow."
                        action={<Button variant="primary" onClick={handleNewFolderClick}>Create Folder</Button>}
                    />
                )}
            </section>

            {/* Suggested Public Folders */}
            {publicFolders.length > 0 && (
                <section className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h2>
                            Suggested Folders
                        </h2>
                        <div className="section-actions">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/folders')}>View all</Button>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {publicFolders.slice(0, 4).map(folder => (
                            <Card
                                key={folder.id || folder.folderId}
                                onClick={() => navigate(`/folders/${folder.id || folder.folderId}`)}
                                title={folder.name}
                                badge={`${folder.setCount} sets`}
                                description={folder.description}
                                ownerName={folder.ownerDisplayName}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Classes Section */}
            <section className="dashboard-section">
                <div className="dashboard-section-header">
                    <h2>My Classes</h2>
                    <div className="section-actions">
                        {isTeacherOrAdmin && (
                            <Button variant="outline" size="sm" onClick={() => setIsCreateClassOpen(true)}>Create Class</Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => triggerComingSoon('Classes Library')}>View all</Button>
                    </div>
                </div>

                {classes.length > 0 ? (
                    <div className="dashboard-grid">
                        {classes.map(cls => (
                            <Card
                                key={cls.classId}
                                onClick={() => handleClassClick(cls.classId)}
                                title={cls.className}
                                badge={cls.status === 'PENDING' ? 'Pending Review' : (cls.status === 'REJECTED' ? 'Rejected' : 'Class')}
                                badgeVariant={cls.status === 'PENDING' ? 'warning' : (cls.status === 'REJECTED' ? 'error' : 'primary')}
                                description={cls.description}
                                ownerName={cls.ownerDisplayName}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Globe}
                        title="No classes yet"
                        description="You hasn't joined any classes yet. Join a class to study with others!"
                        action={<Button variant="primary" onClick={() => triggerComingSoon('Explore Classes')}>Explore Classes</Button>}
                    />
                )}
            </section>

            <CreateClassModal
                isOpen={isCreateClassOpen}
                onClose={() => setIsCreateClassOpen(false)}
                onCreateSuccess={handleClassCreated}
            />
        </div>
    );
};

export default DashboardPage;
