import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Table, Pagination, EmptyState, Loader } from '../../components/ui';
import { getUserStatistics, getFlashcardSetStatistics } from '../../api/statistics';
import { useToast } from '../../context/ToastContext';
import { Activity, BarChart3, Users, GraduationCap } from 'lucide-react';
import './AdminDashboard.css';
import './StatisticsPage.css';

const StatisticsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    // Map paths to active view
    const getActiveView = () => {
        if (location.pathname.includes('/flashcards')) return 'flashcards';
        if (location.pathname.includes('/classes')) return 'classes';
        return 'users';
    };

    const activeView = getActiveView();

    // -- STATS STATE --
    const [userStats, setUserStats] = useState([]);
    const [isUserStatsLoading, setIsUserStatsLoading] = useState(true);
    const [userStatsPage, setUserStatsPage] = useState(0);
    const [userStatsTotalPages, setUserStatsTotalPages] = useState(0);

    const [flashcardStats, setFlashcardStats] = useState([]);
    const [isFlashcardStatsLoading, setIsFlashcardStatsLoading] = useState(true);
    const [flashcardStatsPage, setFlashcardStatsPage] = useState(0);
    const [flashcardStatsTotalPages, setFlashcardStatsTotalPages] = useState(0);

    useEffect(() => {
        if (activeView === 'users') fetchUserStats();
        else if (activeView === 'flashcards') fetchFlashcardStats();
    }, [activeView, userStatsPage, flashcardStatsPage]);

    const fetchUserStats = async () => {
        try {
            setIsUserStatsLoading(true);
            const data = await getUserStatistics(userStatsPage, 10);
            setUserStats(data.content);
            setUserStatsTotalPages(data.totalPages);
        } catch (error) {
            toast.error("Failed to fetch user statistics");
        } finally {
            setIsUserStatsLoading(false);
        }
    };

    const fetchFlashcardStats = async () => {
        try {
            setIsFlashcardStatsLoading(true);
            const data = await getFlashcardSetStatistics(flashcardStatsPage, 10);
            setFlashcardStats(data.content);
            setFlashcardStatsTotalPages(data.totalPages);
        } catch (error) {
            toast.error("Failed to fetch flashcard statistics");
        } finally {
            setIsFlashcardStatsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const renderContent = () => {
        if (activeView === 'users') {
            return (
                <div className="admin-tab-content w-full">
                    <Card className="user-list-card w-full mb-6">
                        <div className="card-header-flex">
                            <h2>User Activity & Statistics</h2>
                            <Button variant="ghost" size="sm" onClick={fetchUserStats}>Refresh</Button>
                        </div>
                        <Table
                            columns={['User', 'Sets Created', 'Cards Created', 'Quizzes Taken', 'Avg Score', 'Last Active']}
                            isLoading={isUserStatsLoading}
                            data={userStats}
                            emptyIcon={Users}
                            emptyTitle="No user statistics"
                            emptyDescription="There are currently no user statistics to display."
                            renderRow={(stat) => (
                                <tr key={stat.userId}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-small">
                                                {stat.profilePictureUrl ? <img src={stat.profilePictureUrl} alt="" /> : (stat.username ? stat.username.charAt(0).toUpperCase() : '?')}
                                            </div>
                                            <div className="user-info-cell">
                                                <span className="user-display-name">{stat.displayName || stat.username || 'Deleted User'}</span>
                                                <span className="user-email">{stat.email || ''}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{stat.totalSets?.toLocaleString() || 0}</td>
                                    <td>{stat.totalCards?.toLocaleString() || 0}</td>
                                    <td>{stat.quizCount?.toLocaleString() || stat.quizzesTaken?.toLocaleString() || 0}</td>
                                    <td>
                                        <Badge variant={stat.avgScore && stat.avgScore >= 80 ? 'success' : stat.avgScore >= 50 ? 'warning' : 'error'}>
                                            {stat.avgScore ? `${Number(stat.avgScore).toFixed(1)}%` : 'N/A'}
                                        </Badge>
                                    </td>
                                    <td>{formatDate(stat.lastActiveAt)}</td>
                                </tr>
                            )}
                        />
                        <Pagination
                            currentPage={userStatsPage}
                            totalPages={userStatsTotalPages}
                            onPageChange={setUserStatsPage}
                        />
                    </Card>
                </div>
            );
        } else if (activeView === 'flashcards') {
            return (
                <div className="admin-tab-content w-full">
                    <Card className="user-list-card w-full mb-6">
                        <div className="card-header-flex">
                            <h2>Flashcard Set Statistics</h2>
                            <Button variant="ghost" size="sm" onClick={fetchFlashcardStats}>Refresh</Button>
                        </div>
                        <Table
                            columns={['Set Title', 'Owner', 'Views', 'Quizzes Taken', 'Avg Retention', 'Last Viewed']}
                            isLoading={isFlashcardStatsLoading}
                            data={flashcardStats}
                            emptyIcon={BarChart3}
                            emptyTitle="No flashcard statistics"
                            emptyDescription="There are currently no flashcard statistics to display."
                            renderRow={(stat) => (
                                <tr key={stat.setId}>
                                    <td className="font-semibold">{stat.title || 'Unknown Set'}</td>
                                    <td>
                                        {stat.ownerDisplayName ? `${stat.ownerDisplayName} (@${stat.ownerUsername})` : 'System'}
                                    </td>
                                    <td>{stat.viewCount?.toLocaleString() || 0}</td>
                                    <td>{stat.quizCount?.toLocaleString() || 0}</td>
                                    <td>
                                        <Badge variant="info">
                                            {stat.retentionRate ? `${stat.retentionRate}%` : 'N/A'}
                                        </Badge>
                                    </td>
                                    <td>{formatDate(stat.lastViewedAt)}</td>
                                </tr>
                            )}
                        />
                        <Pagination
                            currentPage={flashcardStatsPage}
                            totalPages={flashcardStatsTotalPages}
                            onPageChange={setFlashcardStatsPage}
                        />
                    </Card>
                </div>
            );
        } else {
            return (
                <div className="admin-tab-content w-full">
                    <Card className="user-list-card w-full mb-6 py-20">
                        <EmptyState
                            icon={GraduationCap}
                            title="Class Statistics Coming Soon"
                            description="Detailed analytics for classes are currently being developed."
                        />
                    </Card>
                </div>
            );
        }
    };

    return (
        <div className="admin-container stats-page-container">
            {/* Top Navigation Cards */}
            <div className="stats-top-nav">
                <button 
                    onClick={() => navigate('/admin/stats/users')}
                    className={`stats-nav-card ${activeView === 'users' ? 'active' : ''}`}
                >
                    <Activity size={22} />
                    <span>User Statistics</span>
                </button>
                <button 
                    onClick={() => navigate('/admin/stats/flashcards')}
                    className={`stats-nav-card ${activeView === 'flashcards' ? 'active' : ''}`}
                >
                    <BarChart3 size={22} />
                    <span>Flashcard Statistics</span>
                </button>
                <button 
                    onClick={() => navigate('/admin/stats/classes')}
                    className={`stats-nav-card ${activeView === 'classes' ? 'active' : ''}`}
                >
                    <GraduationCap size={22} />
                    <span>Class Statistics</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="stats-content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default StatisticsPage;
