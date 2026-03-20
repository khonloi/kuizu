import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Button } from '../index';
import './CelebrationModal.css';

const CelebrationModal = ({ isOpen, onClose, setTitle }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`celebration-overlay ${isVisible ? 'active' : ''}`} onClick={onClose}>
            <div className="celebration-container" onClick={e => e.stopPropagation()}>
                <button className="close-corner" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <div className="celebration-content">
                    <div className="icon-wrapper bounce-in">
                        <Trophy size={80} className="trophy-icon" />
                        <Sparkles size={40} className="sparkle-1" />
                        <Star size={30} className="star-1" />
                        <Star size={20} className="star-2" />
                    </div>
                    
                    <h2 className="celebration-title">Mastery Achieved!</h2>
                    <p className="celebration-text">
                        Incredible work! You've mastered all terms in <strong>{setTitle}</strong>. 
                        You're officially an expert on this subject!
                    </p>
                    
                    <div className="stats-pill">
                        <CheckCircle2 size={18} className="check-icon" />
                        <span>100% Progress Reached</span>
                    </div>

                    <div className="celebration-footer">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="w-full celebration-btn"
                            onClick={onClose}
                        >
                            Keep it up!
                        </Button>
                    </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="bg-glare"></div>
            </div>
        </div>
    );
};

export default CelebrationModal;
