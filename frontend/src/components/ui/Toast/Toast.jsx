import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(Math.ceil(duration / 1000));

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        const countdown = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdown);
        };
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match CSS transition
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={18} />;
            case 'error':
                return <AlertCircle size={18} />;
            case 'info':
            default:
                return <Info size={18} />;
        }
    };

    return (
        <div className={`toast toast-${type} ${isExiting ? 'toast-exiting' : ''}`}>
            <div className="toast-icon">
                {getIcon()}
            </div>
            <div className="toast-content">
                {message}
            </div>
            <div className="toast-meta">
                <span className="toast-countdown">{timeLeft}s</span>
                <button className="toast-close" onClick={handleClose}>
                    <X size={16} />
                </button>
            </div>
            <div
                className="toast-progress"
                style={{ animationDuration: `${duration}ms` }}
            ></div>
        </div>
    );
};

export default Toast;
