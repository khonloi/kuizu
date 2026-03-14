import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFolderDetail } from '../../api/folder';
import { Loader } from '../../components/ui';
import { ArrowLeft, BookOpen, FolderOpen, User, Eye, Calendar, Layers, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import './FolderDetailPage.css';

const FolderDetailPage = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [folder, setFolder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSets, setExpandedSets] = useState({});

    useEffect(() => {
        const fetchFolder = async () => {
            try {
                setIsLoading(true);
                const data = await getFolderDetail(folderId);
                setFolder(data);
                // Mở rộng tất cả các set mặc định
                if (data?.sets) {
                    const expanded = {};
                    data.sets.forEach(s => { expanded[s.setId] = true; });
                    setExpandedSets(expanded);
                }
            } catch (error) {
                console.error("Failed to fetch folder detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFolder();
    }, [folderId]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getTotalTerms = () => {
        if (!folder?.sets) return 0;
        return folder.sets.reduce((sum, set) => sum + (set.termCount || 0), 0);
    };

    const toggleSetExpand = (setId) => {
        setExpandedSets(prev => ({
            ...prev,
            [setId]: !prev[setId]
        }));
    };

    const expandAll = () => {
        if (!folder?.sets) return;
        const expanded = {};
        folder.sets.forEach(s => { expanded[s.setId] = true; });
        setExpandedSets(expanded);
    };

    const collapseAll = () => {
        setExpandedSets({});
    };

    const allExpanded = folder?.sets?.every(s => expandedSets[s.setId]);

    if (isLoading) {
        return <Loader fullPage={true} />;
    }

    if (!folder) {
        return (
            <div className="fd-container">
                <p>Không tìm thấy thư mục.</p>
            </div>
        );
    }

    return (
        <div className="fd-container">
            {/* Back button */}
            <button className="fd-back" onClick={() => navigate('/folders')}>
                <ArrowLeft size={18} />
                <span>Quay lại thư mục</span>
            </button>

            {/* ====== FOLDER INFO SECTION ====== */}
            <div className="fd-info-card">
                <div className="fd-info-header">
                    <div className="fd-info-icon">
                        <FolderOpen size={28} />
                    </div>
                    <div className="fd-info-header-text">
                        <h1 className="fd-name">{folder.name}</h1>
                        {folder.description && (
                            <p className="fd-description">{folder.description}</p>
                        )}
                    </div>
                </div>

                <div className="fd-info-grid">
                    <div className="fd-info-item">
                        <User size={16} />
                        <div>
                            <span className="fd-info-label">Người tạo</span>
                            <span className="fd-info-value">{folder.ownerDisplayName}</span>
                        </div>
                    </div>
                    <div className="fd-info-item">
                        <Layers size={16} />
                        <div>
                            <span className="fd-info-label">Số học phần</span>
                            <span className="fd-info-value">{folder.sets?.length || 0} học phần</span>
                        </div>
                    </div>
                    <div className="fd-info-item">
                        <Hash size={16} />
                        <div>
                            <span className="fd-info-label">Tổng thuật ngữ</span>
                            <span className="fd-info-value">{getTotalTerms()} thuật ngữ</span>
                        </div>
                    </div>
                    <div className="fd-info-item">
                        <Eye size={16} />
                        <div>
                            <span className="fd-info-label">Hiển thị</span>
                            <span className="fd-info-value">
                                {folder.visibility === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                            </span>
                        </div>
                    </div>
                    <div className="fd-info-item">
                        <Calendar size={16} />
                        <div>
                            <span className="fd-info-label">Ngày tạo</span>
                            <span className="fd-info-value">{formatDate(folder.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ====== TERMS LIST SECTION ====== */}
            <div className="fd-terms-section">
                <div className="fd-terms-header">
                    <h2>Danh sách thuật ngữ trong thư mục</h2>
                    <div className="fd-terms-header-actions">
                        <button
                            className="fd-toggle-all-btn"
                            onClick={allExpanded ? collapseAll : expandAll}
                        >
                            {allExpanded ? (
                                <><ChevronUp size={14} /> Thu gọn tất cả</>
                            ) : (
                                <><ChevronDown size={14} /> Mở rộng tất cả</>
                            )}
                        </button>
                        <span className="fd-terms-badge">{getTotalTerms()} thuật ngữ</span>
                    </div>
                </div>

                {folder.sets && folder.sets.length > 0 ? (
                    <div className="fd-terms-groups">
                        {folder.sets.map(set => {
                            const isExpanded = expandedSets[set.setId];
                            return (
                                <div key={set.setId} className={`fd-set-group ${isExpanded ? 'expanded' : ''}`}>
                                    {/* Set title bar — clickable to toggle */}
                                    <div
                                        className="fd-set-title-bar"
                                        onClick={() => toggleSetExpand(set.setId)}
                                    >
                                        <div className="fd-set-title-left">
                                            <BookOpen size={18} />
                                            <h3>{set.title}</h3>
                                            <span className="fd-set-count-chip">{set.termCount} thuật ngữ</span>
                                        </div>
                                        <div className="fd-set-title-right">
                                            <div className="fd-set-owner-chip">
                                                <div className="fd-set-avatar">
                                                    {getInitials(set.ownerDisplayName)}
                                                </div>
                                                <span>{set.ownerDisplayName}</span>
                                            </div>
                                            <div className="fd-set-toggle">
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Collapsible content */}
                                    {isExpanded && (
                                        <div className="fd-set-content">
                                            {set.description && (
                                                <p className="fd-set-desc">{set.description}</p>
                                            )}

                                            {set.flashcards && set.flashcards.length > 0 && (
                                                <div className="fd-terms-table">
                                                    <div className="fd-terms-table-header">
                                                        <div className="fd-th-num">#</div>
                                                        <div className="fd-th-term">Thuật ngữ</div>
                                                        <div className="fd-th-def">Định nghĩa</div>
                                                    </div>
                                                    {set.flashcards.map((card, index) => (
                                                        <div key={card.cardId} className="fd-terms-row">
                                                            <div className="fd-td-num">{index + 1}</div>
                                                            <div className="fd-td-term">{card.term}</div>
                                                            <div className="fd-td-def">{card.definition}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="fd-empty">
                        <BookOpen size={32} color="var(--text-light)" />
                        <p>Thư mục này chưa có học phần nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FolderDetailPage;
