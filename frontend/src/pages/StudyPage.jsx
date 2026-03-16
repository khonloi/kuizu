import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, RotateCcw, CheckCircle2, XCircle, Trophy, Keyboard, Shuffle } from 'lucide-react';
import { getFlashcardsBySetId } from '../api/flashcards';
import { updateStudyProgress } from '../api/study';
import { useToast } from '../context/ToastContext';
import { Button, Card, Loader } from '../components/ui';
import MainLayout from '../components/layout';
import './StudyPage.css';

const StudyPage = () => {
    const { setId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [cards, setCards] = useState(location.state?.cards || []);
    const [loading, setLoading] = useState(!location.state?.cards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [hasTriggeredFinish, setHasTriggeredFinish] = useState(false);

    const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

    useEffect(() => {
        if (progress === 100 && !hasTriggeredFinish && !loading && cards.length > 0) {
            toast.success('Amazing! You reached 100%!', 5000);
            setHasTriggeredFinish(true);
        }
    }, [progress, hasTriggeredFinish, toast, loading, cards.length]);

    useEffect(() => {
        if (cards.length === 0) {
            fetchCards();
        }
    }, [setId]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const fetchCards = async () => {
        try {
            setLoading(true);
            const data = await getFlashcardsBySetId(setId);
            setCards(shuffleArray(data));
        } catch (err) {
            console.error('Failed to load cards:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleShuffle = () => {
        const shuffled = shuffleArray(cards);
        setCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isFinished) return;

            if (e.code === 'Space') {
                e.preventDefault();
                handleFlip();
            } else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
                e.preventDefault();
                handleNext();
            } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
                e.preventDefault();
                handlePrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, isFlipped, isFinished, cards.length]);

    if (loading) return <MainLayout><div className="loading-container"><Loader /></div></MainLayout>;

    if (cards.length === 0) return (
        <MainLayout>
            <div className="error-container">
                <p>No cards found in this set.</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        </MainLayout>
    );

    if (isFinished) {
        return (
            <MainLayout>
                <div className="study-finished-container">
                    <Card className="finish-card">
                        <Trophy size={64} className="finish-icon" />
                        <h2>Congratulations!</h2>
                        <p>You've completed this study session. All {cards.length} cards reviewed!</p>

                        <div className="finish-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                            <Button
                                onClick={() => {
                                    setCards(shuffleArray(cards));
                                    setCurrentIndex(0);
                                    setIsFlipped(false);
                                    setIsFinished(false);
                                    setHasTriggeredFinish(false);
                                }}
                            >
                                <RotateCcw size={18} />
                                Study Again
                            </Button>
                            <Button variant="outline" onClick={() => navigate(`/flashcard-sets/${setId}`)}>
                                Return to Set
                            </Button>
                        </div>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    const currentCard = cards[currentIndex];
    if (!currentCard) return null; // Safety check

    return (
        <MainLayout>
            <div className="study-page-container">
                <div className="study-header">
                    <button className="back-link" onClick={() => navigate(`/flashcard-sets/${setId}`)}>
                        <ChevronLeft size={20} />
                        Exit Study
                    </button>

                    <div className="study-progress-container">
                        <div className="progress-info">
                            <span>Card {currentIndex + 1} of {cards.length}</span>
                            <span>{Math.round(progress)}% progress</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div className="study-actions">
                        <button
                            className="shuffle-btn"
                            onClick={handleShuffle}
                            title="Shuffle cards"
                        >
                            <Shuffle size={20} />
                        </button>
                    </div>
                </div>

                <div className="study-card-area">
                    <div
                        className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`}
                        onClick={handleFlip}
                    >
                        {/* Front Face */}
                        <div className="flashcard-face flashcard-front">
                            <span className="face-label">Term</span>
                            <div className="card-text">{currentCard.term}</div>
                            <span className="card-hint">Click or press Space to flip</span>
                        </div>

                        {/* Back Face */}
                        <div className="flashcard-face flashcard-back">
                            <span className="face-label">Definition</span>
                            <div className="card-text">{currentCard.definition}</div>
                            <span className="card-hint">Click or press Space to flip back</span>
                        </div>
                    </div>

                    <div className="study-controls">
                        <div className="control-btn">
                            <Button
                                variant="outline"
                                size="lg"
                                className="nav-btn"
                                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft size={24} />
                                Previous
                            </Button>
                            <span className="btn-label">Press ←</span>
                        </div>

                        <div className="control-btn">
                            <Button
                                size="lg"
                                className="nav-btn"
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            >
                                {currentIndex === cards.length - 1 ? 'Finish' : (
                                    <>
                                        Next
                                        <ChevronLeft size={24} style={{ transform: 'rotate(180deg)' }} />
                                    </>
                                )}
                            </Button>
                            <span className="btn-label">Press →</span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default StudyPage;
