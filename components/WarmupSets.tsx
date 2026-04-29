import React, { useState } from 'react';
import { Unit, Rounding, PlateCount } from '../types';
import { KG_PER_LB } from '../constants';
import { calculatePlatesForTarget } from '../services/calculatorService';
import { Card } from './ui/Card';
import { PlateIcon } from './ui/PlateIcon';
import { BarVisualization } from './ui/BarVisualization';

interface WarmupSetsProps {
    workingWeight: number;
    unit: Unit;
    barWeightLbs: number;
    rounding: Rounding;
}

const WARMUP_SCHEME = [
    { pct: 0, reps: 10, label: 'Barra vacía' },
    { pct: 50, reps: 8, label: '50%' },
    { pct: 65, reps: 5, label: '65%' },
    { pct: 75, reps: 3, label: '75%' },
    { pct: 85, reps: 2, label: '85%' },
    { pct: 100, reps: 0, label: 'Trabajo' },
];

export const WarmupSets: React.FC<WarmupSetsProps> = ({ workingWeight, unit, barWeightLbs, rounding }) => {
    const [expandedSet, setExpandedSet] = useState<number | null>(null);

    const barWeight = unit === 'kg' ? barWeightLbs * KG_PER_LB : barWeightLbs;

    const sets = WARMUP_SCHEME.map(({ pct, reps, label }) => {
        const target = pct === 0 ? barWeight : workingWeight * (pct / 100);
        const result = calculatePlatesForTarget(target, barWeight, unit, rounding);
        return { pct, reps, label, target, result };
    });

    return (
        <Card className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-1">Calentamiento</h3>
            <p className="text-xs text-slate-500 mb-3">Peso de trabajo: {workingWeight.toFixed(1)} {unit} · Toca un set para ver los discos</p>
            <div className="space-y-1.5">
                {sets.map(({ pct, reps, label, result }, i) => {
                    const isExpanded = expandedSet === i;
                    const actual = result?.actual ?? 0;
                    const plates = result?.plates ?? {};
                    const hasPlates = Object.keys(plates).length > 0;
                    const isWorking = pct === 100;

                    return (
                        <div key={i}>
                            <button
                                onClick={() => setExpandedSet(isExpanded ? null : i)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors ${
                                    isWorking
                                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                                        : isExpanded
                                            ? 'bg-cyan-500/10 border border-cyan-500/20'
                                            : 'bg-slate-800 hover:bg-slate-750'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`font-semibold text-xs px-2 py-0.5 rounded ${isWorking ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                        {i + 1}
                                    </span>
                                    <span className={`text-xs ${isWorking ? 'text-emerald-400' : 'text-slate-400'}`}>{label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-white">{actual.toFixed(1)} {unit}</span>
                                    {reps > 0 && <span className="text-xs text-slate-500">x{reps}</span>}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </button>
                            {isExpanded && (
                                <div className="mt-1 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <BarVisualization plates={plates} unit={unit} />
                                    {hasPlates ? (
                                        <ul className="space-y-1 mt-2">
                                            {Object.entries(plates).sort(([a], [b]) => Number(b) - Number(a)).map(([w, count]) => (
                                                <li key={w} className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-400">{count} x</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <PlateIcon weight={Number(w)} unit={unit} className="w-5 h-5" />
                                                        <span className="font-mono text-cyan-400 w-14 text-right">{w} {unit}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-500 text-center">Solo la barra</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
