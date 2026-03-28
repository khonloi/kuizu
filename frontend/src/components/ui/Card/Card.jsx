import React from 'react';
import { User } from 'lucide-react';
import Badge from '../Badge/Badge';
import './Card.css';

const Card = ({ 
    children, 
    className = '', 
    title, 
    badge,
    badgeIcon: BadgeIcon,
    badgeVariant = 'primary',
    description,
    ownerName,
    footerRight,
    actions,
    onClick,
    ...props 
}) => {
    // If it has a title, it's an "Item Card" layout
    if (title) {
        return (
            <div 
                className={`card item-card ${className}`} 
                onClick={onClick} 
                {...props}
            >
                <div className="item-card-header">
                    <h3 className="item-card-title">{title}</h3>
                    {badge && (
                        <Badge variant={badgeVariant} className="item-card-badge">
                            {BadgeIcon && <BadgeIcon size={12} className="badge-icon" />}
                            {badge}
                        </Badge>
                    )}
                </div>
                <div className="item-card-body">
                    <p className="item-card-description">
                        {description || 'No description provided.'}
                    </p>
                </div>
                <div className="item-card-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            <User size={14} />
                        </div>
                        <span className="username">{ownerName}</span>
                    </div>
                    {footerRight && (
                        <div className="item-card-footer-right">
                            {footerRight}
                        </div>
                    )}
                    {actions && (
                        <div className="item-card-actions" onClick={(e) => e.stopPropagation()}>
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`card ${className}`} 
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`card-header ${className}`} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
    <h3 className={`card-title ${className}`} {...props}>
        {children}
    </h3>
);

const CardBody = ({ children, className = '', ...props }) => (
    <div className={`card-body ${className}`} {...props}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`card-footer ${className}`} {...props}>
        {children}
    </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
