import React, { useState, useMemo } from 'react';
import { Unit } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface EstimateRmProps {
    unit: Unit;
    onUseEstimate?: (estimate: number) => void;
}

/** Epley formula: 1RM = w × (1 + r/30) */
const epley = (w: number, r: number) => w * (1 + r / 30);

/** Brzycki formula: 1RM = w × 36 / (37 - r) */
const brzycki = (w: number, r: number) => r >= 37 ? 0 : w * 36 / (37 - r);

export const EstimateRm: React.FC<EstimateRmProps> = ({ unit, onUseEstimate }) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    const valid = !isNaN(w) && w > 0 && !isNaN(r) && r >= 1 && r <= 30;

    const estimates = useMemo(() => {
        if (!valid) return null;
        if (r === 1) return { epley: w, brzycki: w, average: w };
        const e = epley(w, r);
        const b = brzycki(w, r);
        return { epley: e, brzycki: b, average: (e + b) / 2 };
    }, [w, r, valid]);

    return (
        <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Estimar 1RM</h2>
            <p className="text-xs text-slate-500 mb-4">Ingresa un peso y las repeticiones que completaste para estimar tu repetición máxima.</p>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="est-weight" className="text-sm font-medium text-slate-300">Peso ({unit})</label>
                    <input
                        id="est-weight"
                        type="number"
                        min="0.01"
                        step="any"
                        placeholder="e.g., 185"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-3 min-h-[44px] text-white focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                <div>
                    <label htmlFor="est-reps" className="text-sm font-medium text-slate-300">Repeticiones</label>
                    <input
                        id="est-reps"
                        type="number"
                        min="1"
                        max="30"
                        step="1"
                        placeholder="e.g., 5"
                        value={reps}
                        onChange={e => setReps(e.target.value)}
                        className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg p-3 min-h-[44px] text-white focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </div>

            {estimates && (
                <div className="mt-5 space-y-3">
                    <div className="text-center">
                        <span className="text-3xl font-bold text-emerald-400">{estimates.average.toFixed(1)}</span>
                        <span className="text-sm text-slate-400 ml-1">{unit}</span>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">1RM Estimado (Promedio)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800 rounded-lg p-3 text-center">
                            <span className="text-lg font-bold text-cyan-400">{estimates.epley.toFixed(1)}</span>
                            <p className="text-xs text-slate-500">Epley</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 text-center">
                            <span className="text-lg font-bold text-cyan-400">{estimates.brzycki.toFixed(1)}</span>
                            <p className="text-xs text-slate-500">Brzycki</p>
                        </div>
                    </div>

                    {onUseEstimate && (
                        <Button onClick={() => onUseEstimate(Math.round(estimates.average * 10) / 10)} className="w-full mt-2">
                            Usar {estimates.average.toFixed(1)} {unit} como 1RM
                        </Button>
                    )}
                </div>
            )}

            {!valid && weight !== '' && reps !== '' && (
                <p className="mt-3 text-sm text-amber-400 text-center">Ingresa un peso positivo y entre 1-30 repeticiones.</p>
            )}

            <div className="mt-4 print:hidden">
                <Button onClick={() => { setWeight(''); setReps(''); }} variant="secondary" className="w-full">Limpiar Datos</Button>
            </div>
        </Card>
    );
};
