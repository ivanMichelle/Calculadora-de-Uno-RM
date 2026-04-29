import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
    const baseClasses = 'min-h-[44px] px-5 py-2.5 rounded-lg font-semibold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center';

    const variants = {
        primary: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 focus:ring-emerald-500',
        secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500 focus:ring-slate-500',
    };

    const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <button className={combinedClasses} {...props} onClick={handleClick}>
            {children}
        </button>
    );
};