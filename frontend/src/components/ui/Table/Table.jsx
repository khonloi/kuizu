import React from 'react';
import Loader from '../Loader/Loader';
import EmptyState from '../EmptyState/EmptyState';
import './Table.css';

const Table = ({ columns, isLoading, data, emptyIcon, emptyTitle, emptyDescription, renderRow }) => {
    if (isLoading) {
        return <Loader size="lg" className="m-auto py-10" />;
    }

    if (!data || data.length === 0) {
        return (
            <div className="py-10">
                <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
            </div>
        );
    }

    return (
        <div className="ui-table-responsive">
            <table className="ui-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => renderRow(item, index))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
