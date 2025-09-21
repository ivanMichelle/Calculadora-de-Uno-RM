import React from 'react';

interface PlateIconProps {
    weight: number;
    className?: string;
}

const PLATE_COLORS: Record<number, { outer: string; inner: string }> = {
    45: { outer: 'fill-blue-500', inner: 'fill-blue-700' },      // Blue
    35: { outer: 'fill-yellow-400', inner: 'fill-yellow-600' }, // Yellow
    25: { outer: 'fill-green-500', inner: 'fill-green-700' },   // Green
    15: { outer: 'fill-slate-300', inner: 'fill-slate-500' },   // Custom - White/Silver
    10: { outer: 'fill-white', inner: 'fill-slate-300' },       // White
    5:  { outer: 'fill-red-500', inner: 'fill-red-700' },       // Red
    2.5:{ outer: 'fill-slate-600', inner: 'fill-slate-800' },   // Black/Dark Grey
    1.25:{ outer: 'fill-gray-400', inner: 'fill-gray-600' },    // Silver/Grey
};

export const PlateIcon: React.FC<PlateIconProps> = ({ weight, className = 'w-10 h-10' }) => {
    const colors = PLATE_COLORS[weight] || { outer: 'fill-gray-500', inner: 'fill-gray-700' };

    return (
        <svg viewBox="0 0 24 24" className={className} role="img" aria-label={`Plate icon for ${weight} lbs`}>
            <circle cx="12" cy="12" r="11" className={colors.outer} />
            <circle cx="12" cy="12" r="4" className={colors.inner} />
        </svg>
    );
};
