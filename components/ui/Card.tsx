
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700/50 print:bg-white print:shadow-none print:border print:border-gray-200 ${className}`}>
            {children}
        </div>
    );
};
