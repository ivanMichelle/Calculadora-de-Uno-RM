import React, { useState } from 'react';
import { KG_PER_LB, LB_PER_KG } from '../constants';
import { Card } from './ui/Card';

export const UnitConverter: React.FC = () => {
    const [lbsValue, setLbsValue] = useState('');
    const [kgValue, setKgValue] = useState('');

    const handleLbsChange = (val: string) => {
        setLbsValue(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setKgValue((num * KG_PER_LB).toFixed(2));
        } else {
            setKgValue('');
        }
    };

    const handleKgChange = (val: string) => {
        setKgValue(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setLbsValue((num * LB_PER_KG).toFixed(2));
        } else {
            setLbsValue('');
        }
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Convertidor de Unidades</h3>
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <label htmlFor="conv-lbs" className="text-xs text-slate-400 uppercase tracking-wider">LBS</label>
                    <input
                        id="conv-lbs"
                        type="number"
                        step="any"
                        placeholder="0"
                        value={lbsValue}
                        onChange={e => handleLbsChange(e.target.value)}
                        className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-2.5 min-h-[44px] text-white text-center text-lg font-mono focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                <div className="pt-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                        <polyline points="7 16 3 12 7 8" /><polyline points="17 8 21 12 17 16" /><line x1="3" y1="12" x2="21" y2="12" />
                    </svg>
                </div>
                <div className="flex-1">
                    <label htmlFor="conv-kg" className="text-xs text-slate-400 uppercase tracking-wider">KG</label>
                    <input
                        id="conv-kg"
                        type="number"
                        step="any"
                        placeholder="0"
                        value={kgValue}
                        onChange={e => handleKgChange(e.target.value)}
                        className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-2.5 min-h-[44px] text-white text-center text-lg font-mono focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </div>
        </Card>
    );
};
