import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../../api/user';
import { Button, Card, Loader, Badge, Modal } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import {
    Users,
    UserCheck,
    UserX,
    ShieldAlert,
    Info,
    Calendar,
    Clock,
    Search
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(null); // stores userId being updated
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await getAllUsers(page, 10);
            setUsers(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.showError("Failed to fetch user list");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        try {
            setIsUpdating(userId);
            const updatedUser = await updateUserStatus(userId, newStatus);

            // Use server response to ensure state matches DB
            setUsers(prevUsers => prevUsers.map(u =>
                u.userId === userId ? updatedUser : u
            ));

            if (selectedUser?.userId === userId) {
                setSelectedUser(updatedUser);
            }

            toast.success(`User ${updatedUser.status === 'SUSPENDED' ? 'suspended' : 'activated'} successfully`);
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update user status");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading && users.length === 0) {
        return <Loader fullPage={true} />;
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="admin-header-main">
                    <h1>Administrator Dashboard</h1>
                    <p className="admin-subtitle">Manage users and platform settings</p>
                </div>
                <div className="admin-stats">
                    <Card className="stat-card">
                        <Users className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-label">Total Users</span>
                            <span className="stat-value">{users.length} on this page</span>
                        </div>
                    </Card>
                </div>
            </header>

            <div className="admin-layout-full">
                <section className="admin-main">
                    <Card className="user-list-card">
                        <div className="card-header-flex">
                            <h2>User Management</h2>
                            <div className="header-actions">
                                <Button variant="ghost" size="sm" onClick={fetchUsers}>
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.userId}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar-small">
                                                        {user.profilePictureUrl ? (
                                                            <img src={user.profilePictureUrl} alt={user.username} />
                                                        ) : (
                                                            user.username.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="user-info-cell">
                                                        <span className="user-display-name">{user.displayName || user.username}</span>
                                                        <span className="user-email">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <Badge variant={user.role === 'ROLE_ADMIN' ? 'error' : user.role === 'ROLE_TEACHER' ? 'success' : 'primary'}>
                                                    {user.role.replace('ROLE_', '')}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge variant={user.status === 'ACTIVE' ? 'success' : user.status === 'SUSPENDED' ? 'error' : 'warning'}>
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewDetails(user)}
                                                        title="View Details"
                                                    >
                                                        <Info size={18} />
                                                    </Button>
                                                    {user.role !== 'ROLE_ADMIN' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={user.status === 'SUSPENDED' ? 'action-activate' : 'action-suspend'}
                                                            onClick={() => handleStatusUpdate(user.userId, user.status)}
                                                            disabled={isUpdating === user.userId}
                                                            title={user.status === 'SUSPENDED' ? 'Activate User' : 'Suspend User'}
                                                        >
                                                            {isUpdating === user.userId ? (
                                                                <Loader size="xs" />
                                                            ) : (
                                                                user.status === 'SUSPENDED' ? <UserCheck size={18} /> : <UserX size={18} />)}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <Button
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <span className="page-info">Page {page + 1} of {totalPages}</span>
                                <Button
                                    disabled={page === totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </Card>
                </section>
            </div>

            {/* User Details Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="User Details"
                size="md"
            >
                {selectedUser && (
                    <div className="user-detail-modal-content">
                        <div className="detail-modal-header">
                            <div className="user-avatar-large">
                                {selectedUser.profilePictureUrl ? (
                                    <img src={selectedUser.profilePictureUrl} alt={selectedUser.username} />
                                ) : (
                                    selectedUser.username.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="header-text">
                                <h3>{selectedUser.displayName || selectedUser.username}</h3>
                                <p>@{selectedUser.username}</p>
                                <div className="detail-status-badge">
                                    <Badge variant={selectedUser.status === 'ACTIVE' ? 'success' : 'error'}>
                                        {selectedUser.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="detail-modal-grid">
                            <div className="detail-item">
                                <label>Email Address</label>
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className="detail-item">
                                <label>User Role</label>
                                <span>{selectedUser.role.replace('ROLE_', '')}</span>
                            </div>
                            <div className="detail-item">
                                <label><Calendar size={14} /> Created At</label>
                                <span>{formatDate(selectedUser.createdAt)}</span>
                            </div>
                            <div className="detail-item">
                                <label><Clock size={14} /> Last Login</label>
                                <span>{formatDate(selectedUser.lastLoginAt)}</span>
                            </div>
                        </div>

                        <div className="detail-item bio-section">
                            <label>Biography</label>
                            <p className="bio-text">{selectedUser.bio || 'No bio provided'}</p>
                        </div>

                        <div className="detail-modal-actions">
                            {selectedUser.role !== 'ROLE_ADMIN' && (
                                <Button
                                    variant={selectedUser.status === 'SUSPENDED' ? 'primary' : 'error'}
                                    onClick={() => handleStatusUpdate(selectedUser.userId, selectedUser.status)}
                                    disabled={isUpdating === selectedUser.userId}
                                    className="w-full"
                                >
                                    {isUpdating === selectedUser.userId ? (
                                        <div className="flex items-center gap-2">
                                            <Loader size="xs" /> Processing...
                                        </div>
                                    ) : (
                                        selectedUser.status === 'SUSPENDED' ? 'Activate Account' : 'Suspend Account'
                                    )}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => setIsDetailModalOpen(false)}
                                className="w-full"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
