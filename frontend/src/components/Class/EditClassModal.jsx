import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Dropdown } from '../ui';
import { updateClass } from '../../api/class';
import { useToast } from '../../context/ToastContext';
import './EditClassModal.css';

const EditClassModal = ({ isOpen, onClose, classData, onUpdateSuccess }) => {
    const toast = useToast();
    const [className, setClassName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const visibilityOptions = [
        { label: 'Public', value: 'PUBLIC' },
        { label: 'Private', value: 'PRIVATE' },
    ];

    useEffect(() => {
        if (classData) {
            setClassName(classData.className || '');
            setDescription(classData.description || '');
            setVisibility(classData.visibility || 'PUBLIC');
        }
    }, [classData, isOpen]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (isSubmitting) return;

        if (!className.trim()) {
            toast.error('Class name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedData = {
                className,
                description,
                visibility
            };

            const updatedClass = await updateClass(classData.classId, updatedData);

            toast.success('Class updated successfully!');

            if (onUpdateSuccess) {
                onUpdateSuccess(updatedClass);
            }
            onClose();

        } catch (error) {
            console.error('Failed to update class:', error);
            toast.error(error.response?.data?.message || 'Failed to update class');
        } finally {
            setIsSubmitting(false);
        }
    };

    const footer = (
        <div className="edit-class-actions">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !className.trim()}
                isLoading={isSubmitting}
            >
                Save Changes
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Class Details"
            size="md"
            footer={footer}
        >
            <div className="edit-class-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group slide-in">
                        <label>Class Name *</label>
                        <Input
                            placeholder="e.g. Introduction to Computer Science"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="form-group slide-in" style={{ animationDelay: '0.1s' }}>
                        <label>Description (Optional)</label>
                        <textarea
                            className="edit-class-textarea"
                            placeholder="What is this class about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        ></textarea>
                    </div>

                    <div className="form-group slide-in" style={{ animationDelay: '0.2s' }}>
                        <label>Visibility</label>
                        <Dropdown
                            variant="select"
                            label={visibilityOptions.find(opt => opt.value === visibility).label}
                            items={visibilityOptions}
                            onItemClick={(item) => setVisibility(item.value)}
                            className="w-full"
                        />
                        <p className="help-text">
                            {visibility === 'PUBLIC'
                                ? 'Anyone can find and request to join this class.'
                                : 'Only people with the join code can find and join this class.'}
                        </p>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditClassModal;
