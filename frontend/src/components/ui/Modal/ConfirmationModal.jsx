import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from '../Button/Button';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    type = "warning", // warning, danger, info
    isLoading = false
}) => {
    const footer = (
        <div className="confirmation-footer">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                {cancelText}
            </Button>
            <Button 
                variant={type === 'danger' ? 'danger' : 'primary'} 
                onClick={onConfirm}
                isLoading={isLoading}
            >
                {confirmText}
            </Button>
        </div>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title} 
            footer={footer}
            size="sm"
        >
            <div className={`confirmation-body type-${type}`}>
                <div className="confirmation-icon-wrapper">
                    <AlertTriangle size={32} />
                </div>
                <p className="confirmation-message">{message}</p>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
