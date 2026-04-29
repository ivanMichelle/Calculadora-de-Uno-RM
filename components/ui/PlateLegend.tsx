import React, { useState } from 'react';
import { Unit } from '../../types';
import { OLYMPIC_PLATES_LBS, OLYMPIC_PLATES_KG } from '../../constants';
import { PlateIcon } from './PlateIcon';

interface PlateLegendProps {
    unit: Unit;
}

export const PlateLegend: React.FC<PlateLegendProps> = ({ unit }) => {
    const [open, setOpen] = useState(false);
    const plates = unit === 'lbs' ? OLYMPIC_PLATES_LBS : OLYMPIC_PLATES_KG;

    return (
        <div className="print:hidden">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mx-auto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                {open ? 'Ocultar leyenda de colores' : 'Ver leyenda de colores'}
            </button>
            {open && (
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {plates.map(weight => (
                        <div key={weight} className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                            <PlateIcon weight={weight} unit={unit} className="w-5 h-5" />
                            <span className="text-xs text-slate-300 font-mono">{weight}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
