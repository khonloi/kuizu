import { useState, useEffect } from 'react';
import {
    ShieldAlert,
    CheckCircle,
    XCircle,
    History,
    UserCog,
    Clock,
    AlertTriangle
} from 'lucide-react';
import {
    processModeration,
    getModerationHistory,
    getPendingSets,
    getPendingClasses,
    getAllUsers
} from '@/api/moderation';
import { Button, Card, Loader, Modal, Textarea, Badge, EmptyState, Tabs } from '@/components/ui';
import MainLayout from '@/components/layout';
import './AdminModerationPage.css';
import { useToast } from '@/context/ToastContext';

const AdminModerationPage = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('sets');
    const [loading, setLoading] = useState(true);
    const [pendingSets, setPendingSets] = useState([]);
    const [pendingClasses, setPendingClasses] = useState([]);
    const [users, setUsers] = useState([]);
    const [history, setHistory] = useState([]);

    // Modal states
    const [isModModalOpen, setIsModModalOpen] = useState(false);
    const [modData, setModData] = useState({
        entityType: '',
        entityId: '',
        action: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'sets') setPendingSets(await getPendingSets());
            if (activeTab === 'classes') setPendingClasses(await getPendingClasses());
            if (activeTab === 'users') setUsers(await getAllUsers());
            if (activeTab === 'history') setHistory(await getModerationHistory());
        } catch (err) {
            toast.error('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModModal = (type, id, action) => {
        setModData({ entityType: type, entityId: id, action: action, notes: '' });
        setIsModModalOpen(true);
    };

    const handleModSubmit = async () => {
        try {
            await processModeration(modData);
            toast.success(`Action ${modData.action} successful!`);
            setIsModModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Action failed.');
        }
    };

    const renderSets = () => (
        <div className="mod-grid">
            {pendingSets.length === 0 ? (
                <EmptyState
                    icon={Clock}
                    title="No pending sets"
                    description="All flashcard sets have been reviewed."
                />
            ) :
                pendingSets.map(set => (
                    <Card
                        key={set.setId}
                        title={set.title}
                        badge="Pending Set"
                        badgeVariant="warning"
                        description={set.description}
                        ownerName={set.ownerDisplayName}
                        actions={
                            <div className="actions">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenModModal('SET', set.setId, 'APPROVE')}
                                    className="approve-btn"
                                >
                                    <CheckCircle size={16} /> Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    className="reject-btn"
                                    size="sm"
                                    onClick={() => handleOpenModModal('SET', set.setId, 'REJECT')}
                                >
                                    <XCircle size={16} /> Reject
                                </Button>
                            </div>
                        }
                    />
                ))}
        </div>
    );

    const renderClasses = () => (
        <div className="mod-grid">
            {pendingClasses.length === 0 ? (
                <EmptyState
                    icon={Clock}
                    title="No pending classes"
                    description="All classes have been reviewed."
                />
            ) :
                pendingClasses.map(cls => (
                    <Card
                        key={cls.classId}
                        title={cls.className}
                        badge="Pending Class"
                        badgeVariant="warning"
                        description={cls.description}
                        ownerName={cls.ownerDisplayName}
                        actions={
                            <div className="actions">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenModModal('CLASS', cls.classId, 'APPROVE')}
                                    className="approve-btn"
                                >
                                    <CheckCircle size={16} /> Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    className="reject-btn"
                                    size="sm"
                                    onClick={() => handleOpenModModal('CLASS', cls.classId, 'REJECT')}
                                >
                                    <XCircle size={16} /> Reject
                                </Button>
                            </div>
                        }
                    />
                ))}
        </div>
    );

    const renderUsers = () => (
        <div className="mod-table-container">
            {users.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No users found"
                    description="There are no users to display."
                />
            ) : (
                <table className="mod-table">
                    <thead>
                        <tr>
                            <th>Display Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td><Badge variant={user.status === 'ACTIVE' ? 'success' : user.status === 'SUSPENDED' ? 'error' : 'warning'}>{user.status}</Badge></td>
                                <td>
                                    {user.status !== 'SUSPENDED' ? (
                                        <Button variant="ghost" size="sm" className="suspend-btn" onClick={() => handleOpenModModal('USER', user.userId, 'SUSPEND')}>
                                            <AlertTriangle size={16} /> Suspend
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="activate-btn" onClick={() => handleOpenModModal('USER', user.userId, 'ACTIVATE')}>
                                            <CheckCircle size={16} /> Reactivate
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderHistory = () => (
        <div className="mod-table-container">
            {history.length === 0 ? (
                <EmptyState
                    icon={History}
                    title="No moderation history"
                    description="All actions will be recorded here for review."
                />
            ) : (
                <table className="mod-table">
                    <thead>
                        <tr>
                            <th>Moderator</th>
                            <th>Entity</th>
                            <th>Action</th>
                            <th>Notes</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(item => (
                            <tr key={item.modId}>
                                <td>{item.moderatorDisplayName}</td>
                                <td>{item.entityType} ({item.entityId})</td>
                                <td>
                                    <Badge variant={item.action === 'APPROVE' ? 'success' : item.action === 'REJECT' || item.action === 'SUSPEND' ? 'error' : 'primary'}>
                                        {item.action}
                                    </Badge>
                                </td>
                                <td className="notes-cell">{item.notes}</td>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    return (
        <MainLayout>
            <div className="moderation-container">
                <header className="mod-header">
                    <div className="title-section">
                        <ShieldAlert className="title-icon" size={32} />
                        <div>
                            <h1>Moderation Dashboard</h1>
                            <p>Global content review and user management</p>
                        </div>
                    </div>
                </header>

                <div className="mod-content">
                    {loading ? (
                        <div style={{ padding: '80px 0' }}>
                            <Loader text="Loading data..." />
                        </div>
                    ) : (
                        <Tabs 
                            tabs={[
                                { label: <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> Flashcard Sets</div>, content: renderSets(), key: 'sets' },
                                { label: <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> Classes</div>, content: renderClasses(), key: 'classes' },
                                { label: <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History size={16} /> User Management</div>, content: renderUsers(), key: 'users' },
                                { label: <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History size={16} /> Mod History</div>, content: renderHistory(), key: 'history' }
                            ]}
                            activeIndex={['sets', 'classes', 'users', 'history'].indexOf(activeTab)}
                            onTabChange={(idx) => setActiveTab(['sets', 'classes', 'users', 'history'][idx])}
                        />
                    )}
                </div>

                <Modal
                    isOpen={isModModalOpen}
                    onClose={() => setIsModModalOpen(false)}
                    title={`Confirm ${modData.action}`}
                >
                    <div className="mod-modal-form">
                        <p>Are you sure you want to <strong>{modData.action}</strong> this {modData.entityType.toLowerCase()}?</p>
                        <div className="form-group">
                            <label>Moderation Notes</label>
                        <Textarea
                            value={modData.notes}
                            onChange={(e) => setModData({ ...modData, notes: e.target.value })}
                            placeholder="Provide a reason for this action..."
                            rows={4}
                        />
                        </div>
                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setIsModModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleModSubmit}>Confirm Action</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </MainLayout>
    );
};

export default AdminModerationPage;
