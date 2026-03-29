import React, { useState, useEffect } from 'react';
import { Save, Loader, Globe, Lock } from 'lucide-react';
import { getFolderDetail, createFolder, updateFolder } from '@/api/folder';
import { Button, Input, Modal, Textarea, Select } from '../ui';
import './FolderModal.css';

const FolderModal = ({ isOpen, onClose, folderId, onSuccess }) => {
    const isEdit = !!folderId;
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility: 'PUBLIC'
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && isEdit) {
            fetchFolder();
        } else if (isOpen && !isEdit) {
            setFormData({
                name: '',
                description: '',
                visibility: 'PUBLIC'
            });
            setError(null);
        }
    }, [isOpen, folderId]);

    const fetchFolder = async () => {
        try {
            setLoading(true);
            const data = await getFolderDetail(folderId);
            setFormData({
                name: data.name,
                description: data.description || '',
                visibility: data.visibility || 'PUBLIC'
            });
        } catch (err) {
            setError('Failed to load folder data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError(null);

            let result;
            if (isEdit) {
                result = await updateFolder(folderId, formData);
            } else {
                result = await createFolder(formData);
            }

            if (onSuccess) onSuccess(result);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const footer = (
        <div className="modal-actions-custom">
            <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={submitting}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                form="folder-form"
                disabled={submitting || loading}
                className="submit-btn"
            >
                {submitting ? <Loader size={18} className="animate-spin" /> : <><Save size={18} /> {isEdit ? 'Save Changes' : 'Create Folder'}</>}
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Folder' : 'Create New Folder'}
            footer={footer}
            size="md"
        >
            {loading ? (
                <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>
            ) : (
                <form id="folder-form" onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="error-msg mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div className="form-group mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Folder Name *</label>
                        <Input
                            id="name"
                            name="name"
                            placeholder='e.g. "Semester 1 Materials"'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </div>

                    <div className="form-group mb-4">
                        <Textarea
                            id="description"
                            name="description"
                            label="Description (Optional)"
                            rows="4"
                            placeholder="What is this folder about?"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                        <div className="visibility-options">
                            <div
                                className={`visibility-option ${formData.visibility === 'PUBLIC' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, visibility: 'PUBLIC' })}
                            >
                                <div className="visibility-radio">
                                    <div className={`radio-dot ${formData.visibility === 'PUBLIC' ? 'checked' : ''}`}></div>
                                </div>
                                <div className="visibility-text">
                                    <span className="visibility-label">🌐 Public</span>
                                    <span className="visibility-desc">Anyone can view this folder</span>
                                </div>
                            </div>
                            <div
                                className={`visibility-option ${formData.visibility === 'PRIVATE' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, visibility: 'PRIVATE' })}
                            >
                                <div className="visibility-radio">
                                    <div className={`radio-dot ${formData.visibility === 'PRIVATE' ? 'checked' : ''}`}></div>
                                </div>
                                <div className="visibility-text">
                                    <span className="visibility-label">🔒 Private</span>
                                    <span className="visibility-desc">Only you can view this folder</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default FolderModal;
