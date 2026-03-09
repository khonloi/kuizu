import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, Menu, Book, Zap, Users, GraduationCap, Palette, Languages, Calculator, FlaskConical, Layout, BookOpen, Folder } from 'lucide-react';
import { Button, Dropdown } from '../../ui';
import './Navbar.css';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { searchClasses } from '../../../api/class';


const Navbar = ({ isSidebarCollapsed, onToggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                setIsSearching(true);
                try {
                    const results = await searchClasses(searchQuery);
                    setSearchResults(results);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        navigate('/auth');
    };

    const handleResultClick = (classId) => {
        setShowDropdown(false);
        setSearchQuery('');
        navigate(`/classes/${classId}`);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim().length > 0) {
            setShowDropdown(false);
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const studyToolsItems = [
        { label: 'Flashcard', icon: <Book size={16} /> },
        { label: 'Quiz', icon: <Zap size={16} /> },
        { label: 'Class', icon: <Users size={16} /> },
    ];

    const subjectItems = [
        { label: 'Exams', icon: <GraduationCap size={16} /> },
        { label: 'Arts and Humanities', icon: <Palette size={16} /> },
        { label: 'Languages', icon: <Languages size={16} /> },
        { label: 'Mathematics', icon: <Calculator size={16} /> },
        { label: 'Science', icon: <FlaskConical size={16} /> },
        { label: 'Others', icon: <Layout size={16} /> },
    ];

    const createItems = [
        { label: 'Flashcard Set', icon: <BookOpen size={16} />, path: '/create/flashcards' },
        { label: 'Folder', icon: <Folder size={16} />, path: '/create/folder' },
        { label: 'Class', icon: <GraduationCap size={16} />, path: '/create/class' },
    ];

    const handleDropdownItemClick = (item) => {
        if (item.path) {
            navigate(item.path);
        } else {
            navigate(`/search?q=${encodeURIComponent(item.label)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <div className="navbar-logo" onClick={() => navigate('/dashboard')}>Kuizu</div>
                    <div className="navbar-links">
                        <Dropdown
                            label="Study Tools"
                            items={studyToolsItems}
                            onItemClick={handleDropdownItemClick}
                            variant="nav"
                        />
                        <Dropdown
                            label="Subjects"
                            items={subjectItems}
                            onItemClick={handleDropdownItemClick}
                            variant="nav"
                        />
                    </div>
                </div>

                <div className="navbar-center">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for classes..."
                            className="nav-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        />
                        {showDropdown && (
                            <div className="search-dropdown">
                                {isSearching ? (
                                    <div className="search-dropdown-item search-dropdown-message">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map(cls => (
                                        <div
                                            key={cls.classId}
                                            className="search-dropdown-item"
                                            onClick={() => handleResultClick(cls.classId)}
                                        >
                                            <div className="search-item-title">{cls.className}</div>
                                            <div className="search-item-owner">by {cls.ownerDisplayName}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="search-dropdown-item search-dropdown-message">No classes found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="navbar-right">
                    <Dropdown
                        items={createItems}
                        onItemClick={handleDropdownItemClick}
                        variant="create-pill"
                        showChevron={false}
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span>Create</span>
                    </Dropdown>
                    {user ? (
                        <div className="nav-profile-section">
                            <img
                                src={user.profilePictureUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                                alt="Profile"
                                className="nav-avatar"
                                onClick={() => navigate('/profile')}
                            />
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="logout-compact-btn">
                                Log Out
                            </Button>
                        </div>

                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            className="login-btn"
                            onClick={() => navigate('/auth')}
                        >
                            Log in
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
