import React from 'react';
import { Unit } from '../../types';

interface PlateIconProps {
    weight: number;
    unit?: Unit;
    className?: string;
}

const PLATE_COLORS_LBS: Record<number, { outer: string; inner: string }> = {
    45: { outer: 'fill-red-500', inner: 'fill-red-700' },
    35: { outer: 'fill-blue-500', inner: 'fill-blue-700' },
    25: { outer: 'fill-yellow-400', inner: 'fill-yellow-600' },
    15: { outer: 'fill-green-500', inner: 'fill-green-700' },
    10: { outer: 'fill-white', inner: 'fill-slate-300' },
    5:  { outer: 'fill-slate-900', inner: 'fill-black' },
    2.5:{ outer: 'fill-slate-600', inner: 'fill-slate-800' },
    1.25:{ outer: 'fill-gray-400', inner: 'fill-gray-600' },
};

const PLATE_COLORS_KG: Record<number, { outer: string; inner: string }> = {
    25: { outer: 'fill-red-500', inner: 'fill-red-700' },
    20: { outer: 'fill-blue-500', inner: 'fill-blue-700' },
    15: { outer: 'fill-yellow-400', inner: 'fill-yellow-600' },
    10: { outer: 'fill-green-500', inner: 'fill-green-700' },
    5:  { outer: 'fill-white', inner: 'fill-slate-300' },
    2.5:{ outer: 'fill-slate-900', inner: 'fill-black' },
    1.25:{ outer: 'fill-slate-600', inner: 'fill-slate-800' },
    0.5:{ outer: 'fill-gray-400', inner: 'fill-gray-600' },
    0.25:{ outer: 'fill-gray-300', inner: 'fill-gray-500' },
};

export const PlateIcon: React.FC<PlateIconProps> = ({ weight, unit = 'lbs', className = 'w-10 h-10' }) => {
    const colorMap = unit === 'kg' ? PLATE_COLORS_KG : PLATE_COLORS_LBS;
    const colors = colorMap[weight] || { outer: 'fill-gray-500', inner: 'fill-gray-700' };

    return (
        <svg viewBox="0 0 24 24" className={className} role="img" aria-label={`Disco de ${weight} ${unit}`}>
            <circle cx="12" cy="12" r="11" className={colors.outer} />
            <circle cx="12" cy="12" r="4" className={colors.inner} />
        </svg>
    );
};
