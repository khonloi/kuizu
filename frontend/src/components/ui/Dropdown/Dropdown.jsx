import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

const Dropdown = ({
    label,
    items,
    onItemClick,
    className = '',
    triggerClassName = 'dropdown-trigger',
    variant = 'ghost', // ghost, field, select
    icon: Icon = ChevronDown,
    showChevron = true,
    children
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleItemClick = (item) => {
        if (onItemClick) {
            onItemClick(item);
        }
        setIsOpen(false);
    };

    return (
        <div className={`dropdown-container ${className}`} ref={dropdownRef}>
            <div
                className={`${triggerClassName} ${variant} ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {children ? children : (
                    <>
                        <span className="dropdown-label">{label}</span>
                        {showChevron && <Icon size={14} strokeWidth={3} className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`} />}
                    </>
                )}
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleItemClick(item)}
                        >
                            {item.icon && <span className="item-icon">{item.icon}</span>}
                            <span className="item-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
