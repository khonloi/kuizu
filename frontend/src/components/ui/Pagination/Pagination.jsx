import React from 'react';
import Button from '../Button/Button';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="ui-pagination">
            <Button disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)} variant="outline" size="sm">Previous</Button>
            <span className="ui-page-info">Page {currentPage + 1} of {totalPages}</span>
            <Button disabled={currentPage === totalPages - 1} onClick={() => onPageChange(currentPage + 1)} variant="outline" size="sm">Next</Button>
        </div>
    );
};

export default Pagination;
