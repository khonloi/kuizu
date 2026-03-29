import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Plus, Pencil, Trash2, User, Layers, BookOpen, FolderOpen } from 'lucide-react';
import './ContentDetailsPage.css';
import { Button, Card, Loader, ConfirmationModal, CelebrationModal, Badge, EmptyState } from '@/components/ui';
import { useModal } from '@/context/ModalContext';
import MainLayout from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const ContentDetailsPage = ({ 
    type = 'sets', // 'sets' or 'folders'
    getById,
    getChildren,
    deleteItem,
    deleteChild,
    openEditModal,
    openAddChildModal,
    openEditChildModal,
    backPath = '/flashcard-sets',
    id: propId
}) => {
    const params = useParams();
    const id = propId || params.id || params.setId || params.folderId;
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success: toastSuccess, error: toastError } = useToast();
    const { openSetModal, openCardModal, openFolderModal } = useModal();
    const [item, setItem] = useState(null);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [childToDelete, setChildToDelete] = useState(null);
    const [isReRequesting, setIsReRequesting] = useState(false);
    const [activeTag, setActiveTag] = useState('all');

    useEffect(() => {
        fetchData();
        if (type === 'sets') trackVisit(id);
    }, [id]);

    const trackVisit = (id) => {
        try {
            const recent = JSON.parse(localStorage.getItem('recent_sets') || '[]');
            const stringId = String(id);
            const filtered = recent.filter(existingId => String(existingId) !== stringId);
            const updated = [stringId, ...filtered].slice(0, 8);
            localStorage.setItem('recent_sets', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to track visit:', e);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [itemData, childrenData] = await Promise.all([
                getById(id),
                getChildren ? getChildren(id) : Promise.resolve(null)
            ]);
            setItem(itemData);
            // In case children are returned in getById (like folders)
            setChildren(childrenData || itemData.sets || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(`Could not load ${type} details.`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSuccess = (updatedItem) => {
        setItem(updatedItem);
    };

    const handleChildSuccess = async () => {
        try {
            const childrenData = getChildren ? await getChildren(id) : (await getById(id)).sets;
            setChildren(childrenData);
        } catch (err) {
            console.error('Error refreshing children:', err);
        }
    };

    const handleAddChildClick = () => {
        if (openAddChildModal) {
            openAddChildModal(id, handleChildSuccess);
        }
    };

    const handleEditChildClick = (childId) => {
        if (openEditChildModal) {
            openEditChildModal(id, childId, handleChildSuccess);
        }
    };

    const handleDeleteChild = async () => {
        if (!childToDelete) return;
        try {
            setIsDeleting(true);
            await deleteChild(id, childToDelete);
            setChildren(children.filter(c => (c.setId || c.cardId) !== childToDelete));
            setChildToDelete(null);
            toastSuccess(`${type === 'sets' ? 'Card' : 'Set'} removed successfully.`);
        } catch (err) {
            toastError(`Failed to remove ${type === 'sets' ? 'card' : 'set'}.`);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return (
        <MainLayout isLoading={true}>
            <div style={{ padding: '100px 0', textAlign: 'center' }}>
                <Loader text="Loading details..." />
            </div>
        </MainLayout>
    );
    
    if (error) return (
        <MainLayout>
            <div style={{ padding: '100px 40px' }}>
                <EmptyState
                    icon={BookOpen}
                    title="Oops! Something went wrong"
                    description={error}
                    action={<Button variant="primary" onClick={() => navigate(backPath)}>Back to List</Button>}
                />
            </div>
        </MainLayout>
    );

    const isOwner = user?.userId === item?.ownerId || user?.username === item?.ownerUsername;

    const filteredChildren = children.filter(child => {
        if (type !== 'folders' || activeTag === 'all') return true;
        // Folders have categories, check if the set is in the active category
        const category = item.categories?.find(c => c.name === activeTag);
        return category?.sets?.some(s => s.setId === child.setId);
    });

    return (
        <MainLayout>
            <div className="content-details-container">
                <Button variant="ghost" className="back-link" onClick={() => navigate(backPath)}>
                    <ChevronLeft size={20} />
                    Back to {type === 'sets' ? 'sets' : 'folders'}
                </Button>

                <div className="content-hero">
                    <div className="content-info-main">
                        <h1 className="content-title">
                            {item.title || item.name}
                            {item.status === 'PENDING' && (
                                <Badge variant="warning" style={{ marginLeft: '12px', verticalAlign: 'middle' }}>Pending Review</Badge>
                            )}
                            {item.status === 'REJECTED' && (
                                <Badge variant="error" style={{ marginLeft: '12px', verticalAlign: 'middle' }}>Rejected</Badge>
                            )}
                            {item.status === 'APPROVED' && (
                                <Badge variant="success" style={{ marginLeft: '12px', verticalAlign: 'middle' }}>Approved</Badge>
                            )}
                        </h1>
                        <p className="content-description">{item.description || 'No description provided.'}</p>

                        <div className="content-meta">
                            <div className="meta-item">
                                <User size={16} />
                                <span>Created by <strong>{item.ownerDisplayName}</strong></span>
                            </div>
                            <div className="meta-item">
                                {type === 'sets' ? <Layers size={16} /> : <FolderOpen size={16} />}
                                <span>{children.length} {type === 'sets' ? 'terms' : 'sets'}</span>
                            </div>
                        </div>

                        {type === 'folders' && item.categories?.length > 0 && (
                            <div className="folder-tags">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`tag-btn ${activeTag === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTag('all')}
                                >
                                    All
                                </Button>
                                {item.categories.map(cat => (
                                    <Button 
                                        key={cat.name}
                                        variant="ghost" 
                                        size="sm" 
                                        className={`tag-btn ${activeTag === cat.name ? 'active' : ''}`}
                                        onClick={() => setActiveTag(cat.name)}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="content-actions">
                        {type === 'sets' ? (
                            <>
                                <Button
                                    className="study-btn w-full"
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate(`/study/${id}`, { state: { cards: children } })}
                                    leftIcon={<BookOpen size={20} />}
                                >
                                    Study
                                </Button>
                                <Button
                                    className="play-btn w-full"
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate(`/quiz/${id}`, { state: { cards: children } })}
                                    disabled={children.length < 2}
                                    leftIcon={<Play size={20} fill="currentColor" />}
                                >
                                    Take Quiz
                                </Button>
                            </>
                        ) : (
                             <Button
                                className="study-btn w-full"
                                size="lg"
                                variant="outline"
                                onClick={() => {
                                    const allCards = children.reduce((acc, set) => [...acc, ...(set.flashcards || [])], []);
                                    if (allCards.length === 0) {
                                         toastError("No flashcards found in this folder's sets.");
                                         return;
                                    }
                                    navigate(`/study/folder-${id}`, { state: { cards: allCards, fromLabel: 'Back to Folder', folderName: item.name } });
                                }}
                                leftIcon={<BookOpen size={20} />}
                            >
                                Study All
                            </Button>
                        )}
                        {isOwner && (
                            <Button
                                className="w-full"
                                variant="outline"
                                size="lg"
                                onClick={() => openEditModal(id, handleUpdateSuccess)}
                                leftIcon={<Pencil size={20} />}
                            >
                                Edit {type === 'sets' ? 'Set' : 'Folder'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="children-section">
                    <div className="section-header">
                        <h2>{type === 'sets' ? 'Terms' : 'Sets'} in this {type === 'sets' ? 'set' : 'folder'} ({children.length})</h2>
                        {isOwner && (
                            <Button
                                variant="ghost"
                                className="add-child-btn"
                                onClick={handleAddChildClick}
                                leftIcon={<Plus size={20} />}
                            >
                                Add {type === 'sets' ? 'Card' : 'Set'}
                            </Button>
                        )}
                    </div>

                    <div className="children-list">
                        {filteredChildren.length > 0 ? (
                            filteredChildren.map((child, index) => (
                                type === 'sets' ? (
                                    <Card key={child.cardId} className="flashcard-item">
                                        <Card.Body className="flashcard-item-body">
                                            <div className="card-index">{index + 1}</div>
                                            <div className="card-content">
                                                <div className="term-side">
                                                    <div className="side-label">TERM</div>
                                                    <div className="side-text">{child.term}</div>
                                                </div>
                                                <div className="divider"></div>
                                                <div className="definition-side">
                                                    <div className="side-label">DEFINITION</div>
                                                    <div className="side-text">{child.definition}</div>
                                                </div>
                                            </div>
                                            {isOwner && (
                                                <div className="card-actions">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditChildClick(child.cardId)}
                                                    >
                                                        <Pencil size={18} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="delete-btn"
                                                        onClick={() => setChildToDelete(child.cardId)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ) : (
                                    <Card
                                        key={child.setId}
                                        onClick={() => navigate(`/flashcard-sets/${child.setId}`)}
                                        title={child.title}
                                        badge={`${child.termCount || child.cardCount || 0} terms`}
                                        description={child.description}
                                        ownerName={child.ownerDisplayName}
                                        actions={isOwner && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setChildToDelete(child.setId);
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        )}
                                    />
                                )
                            ))
                        ) : (
                            <div className="empty-children">
                                <p>No {type === 'sets' ? 'flashcards' : 'sets'} here yet.</p>
                                {isOwner && (
                                    <Button onClick={handleAddChildClick}>
                                        Add your first {type === 'sets' ? 'card' : 'set'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Child Confirmation */}
                <ConfirmationModal
                    isOpen={!!childToDelete}
                    onClose={() => setChildToDelete(null)}
                    onConfirm={handleDeleteChild}
                    title={`Remove ${type === 'sets' ? 'Flashcard' : 'Set'}`}
                    message={`Are you sure you want to remove this ${type === 'sets' ? 'card' : 'set'}? This action cannot be undone.`}
                    confirmText="Remove"
                    type="danger"
                    isLoading={isDeleting}
                />
            </div>
        </MainLayout>
    );
};

export default ContentDetailsPage;
