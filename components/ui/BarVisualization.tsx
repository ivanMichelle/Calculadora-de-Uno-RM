import React from 'react';
import { PlateCount, Unit } from '../../types';

interface BarVisualizationProps {
    plates: PlateCount;
    unit: Unit;
}

// Color mapping for plate weights — covers both LBS and KG standard plates
const PLATE_BG_COLORS: Record<number, string> = {
    // LBS plates
    45: 'bg-red-500',
    35: 'bg-blue-500',
    25: 'bg-yellow-400',
    20: 'bg-blue-500',
    15: 'bg-green-500',
    10: 'bg-white',
    5: 'bg-slate-900 border border-slate-600',
    2.5: 'bg-slate-600',
    1.25: 'bg-gray-400',
    0.5: 'bg-gray-300',
    0.25: 'bg-gray-200',
};

// Plate height based on weight (heavier = taller)
const getPlateHeight = (weight: number): string => {
    if (weight >= 45) return 'h-16';
    if (weight >= 25) return 'h-14';
    if (weight >= 15) return 'h-12';
    if (weight >= 10) return 'h-10';
    if (weight >= 5) return 'h-8';
    return 'h-6';
};

// Plate width based on weight (heavier = wider)
const getPlateWidth = (weight: number): string => {
    if (weight >= 35) return 'w-3';
    if (weight >= 15) return 'w-2.5';
    if (weight >= 5) return 'w-2';
    return 'w-1.5';
};

export const BarVisualization: React.FC<BarVisualizationProps> = ({ plates, unit }) => {
    // Build an array of individual plates sorted heaviest first
    const plateArray: number[] = [];
    Object.entries(plates)
        .sort(([a], [b]) => Number(b) - Number(a))
        .forEach(([weight, count]) => {
            for (let i = 0; i < count; i++) {
                plateArray.push(Number(weight));
            }
        });

    const hasPlates = plateArray.length > 0;

    return (
        <div className="py-3 print:hidden" aria-label={`Barra con ${plateArray.length} discos por lado`}>
            <div className="flex items-center justify-center gap-0 overflow-x-auto">
                {/* Left plates (mirrored) */}
                <div className="flex items-center gap-0.5 flex-row-reverse">
                    {plateArray.map((weight, i) => (
                        <div
                            key={`l-${i}`}
                            className={`${getPlateHeight(weight)} ${getPlateWidth(weight)} ${PLATE_BG_COLORS[weight] || 'bg-gray-500'} rounded-sm transition-all duration-200`}
                            title={`${weight} ${unit}`}
                        />
                    ))}
                </div>

                {/* Left collar */}
                {hasPlates && <div className="h-5 w-1.5 bg-slate-400 rounded-sm" />}

                {/* Bar */}
                <div className="h-2.5 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-full" style={{ minWidth: hasPlates ? '60px' : '120px' }} />

                {/* Right collar */}
                {hasPlates && <div className="h-5 w-1.5 bg-slate-400 rounded-sm" />}

                {/* Right plates */}
                <div className="flex items-center gap-0.5">
                    {plateArray.map((weight, i) => (
                        <div
                            key={`r-${i}`}
                            className={`${getPlateHeight(weight)} ${getPlateWidth(weight)} ${PLATE_BG_COLORS[weight] || 'bg-gray-500'} rounded-sm transition-all duration-200`}
                            title={`${weight} ${unit}`}
                        />
                    ))}
                </div>
            </div>
            {!hasPlates && (
                <p className="text-center text-xs text-slate-600 mt-1">Barra vacía</p>
            )}
        </div>
    );
};
