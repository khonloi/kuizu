import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from '../ui';
import { createFolder, getMySets } from '../../api/folder';
import { useToast } from '../../context/ToastContext';
import { BookOpen, Check } from 'lucide-react';
import './CreateFolderModal.css';

const CreateFolderModal = ({ isOpen, onClose, onCreateSuccess }) => {
    const toast = useToast();
    const [folderName, setFolderName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [mySets, setMySets] = useState([]);
    const [selectedSetIds, setSelectedSetIds] = useState([]);
    const [isLoadingSets, setIsLoadingSets] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFolderName('');
            setDescription('');
            setVisibility('PUBLIC');
            setSelectedSetIds([]);
            
            const fetchSets = async () => {
                setIsLoadingSets(true);
                try {
                    const data = await getMySets();
                    setMySets(data);
                } catch (error) {
                    console.error('Failed to fetch user sets:', error);
                } finally {
                    setIsLoadingSets(false);
                }
            };
            fetchSets();
        }
    }, [isOpen]);

    const toggleSetSelection = (setId) => {
        setSelectedSetIds(prev => 
            prev.includes(setId) 
                ? prev.filter(id => id !== setId)
                : [...prev, setId]
        );
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (isSubmitting) return;

        if (!folderName.trim()) {
            toast.error('Tên thư mục không được để trống');
            return;
        }

        setIsSubmitting(true);
        try {
            const folderData = {
                name: folderName,
                description,
                visibility,
                setIds: selectedSetIds
            };

            const newFolder = await createFolder(folderData);
            toast.success('Tạo thư mục thành công!');

            if (onCreateSuccess) {
                onCreateSuccess(newFolder);
            }
            onClose();

        } catch (error) {
            console.error('Failed to create folder:', error);
            toast.error(error.response?.data?.message || 'Không thể tạo thư mục');
        } finally {
            setIsSubmitting(false);
        }
    };

    const footer = (
        <div className="create-folder-actions">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Hủy
            </Button>
            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !folderName.trim()}
                isLoading={isSubmitting}
            >
                Tạo thư mục
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tạo thư mục mới"
            size="md"
            footer={footer}
        >
            <div className="create-folder-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group slide-in">
                        <label>Tên thư mục *</label>
                        <Input
                            placeholder="Ví dụ: Tài liệu Học kỳ 1"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="form-group slide-in" style={{ animationDelay: '0.1s' }}>
                        <label>Mô tả (Không bắt buộc)</label>
                        <textarea
                            className="create-folder-textarea"
                            placeholder="Mô tả nội dung thư mục..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        ></textarea>
                    </div>

                    <div className="form-group slide-in" style={{ animationDelay: '0.15s' }}>
                        <label>Đề xuất học phần (Không bắt buộc)</label>
                        <div className="suggested-sets-list">
                            {isLoadingSets ? (
                                <div className="loading-sets">Đang tải học phần...</div>
                            ) : mySets.length === 0 ? (
                                <div className="empty-sets-msg">Bạn chưa có học phần nào.</div>
                            ) : (
                                mySets.map(set => (
                                    <div 
                                        key={set.setId} 
                                        className={`suggested-set-item ${selectedSetIds.includes(set.setId) ? 'selected' : ''}`}
                                        onClick={() => toggleSetSelection(set.setId)}
                                    >
                                        <div className="set-item-main">
                                            <BookOpen size={16} className="set-icon" />
                                            <div className="set-info-minimal">
                                                <div className="set-title">{set.title}</div>
                                                <div className="set-terms">{set.termCount} thuật ngữ</div>
                                            </div>
                                        </div>
                                        <div className="set-checkbox">
                                            {selectedSetIds.includes(set.setId) && <Check size={14} />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="form-group slide-in" style={{ animationDelay: '0.2s' }}>
                        <label>Hiển thị</label>
                        <div className="visibility-options">
                            <div
                                className={`visibility-option ${visibility === 'PUBLIC' ? 'active' : ''}`}
                                onClick={() => setVisibility('PUBLIC')}
                            >
                                <div className="visibility-radio">
                                    <div className={`radio-dot ${visibility === 'PUBLIC' ? 'checked' : ''}`}></div>
                                </div>
                                <div className="visibility-text">
                                    <span className="visibility-label">🌐 Công khai</span>
                                    <span className="visibility-desc">Tất cả người dùng đều có thể xem thư mục này</span>
                                </div>
                            </div>
                            <div
                                className={`visibility-option ${visibility === 'PRIVATE' ? 'active' : ''}`}
                                onClick={() => setVisibility('PRIVATE')}
                            >
                                <div className="visibility-radio">
                                    <div className={`radio-dot ${visibility === 'PRIVATE' ? 'checked' : ''}`}></div>
                                </div>
                                <div className="visibility-text">
                                    <span className="visibility-label">🔒 Riêng tư</span>
                                    <span className="visibility-desc">Chỉ bạn mới có thể xem thư mục này</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateFolderModal;
