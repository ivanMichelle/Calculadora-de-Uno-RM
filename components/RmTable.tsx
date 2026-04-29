import React, { useState } from 'react';
import { Unit, Rounding, PlateCount } from '../types';
import { KG_PER_LB } from '../constants';
import { calculatePlatesForTarget } from '../services/calculatorService';
import { Card } from './ui/Card';
import { PlateIcon } from './ui/PlateIcon';
import { BarVisualization } from './ui/BarVisualization';

interface RmTableProps {
    oneRepMax: number;
    unit: Unit;
    barWeightLbs: number;
    rounding: Rounding;
}

const TABLE_PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

export const RmTable: React.FC<RmTableProps> = ({ oneRepMax, unit, barWeightLbs, rounding }) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const barWeight = unit === 'kg' ? barWeightLbs * KG_PER_LB : barWeightLbs;

    const rows = TABLE_PERCENTAGES.map(pct => {
        const target = oneRepMax * (pct / 100);
        const result = calculatePlatesForTarget(target, barWeight, unit, rounding);
        return { pct, target, result };
    });

    return (
        <Card className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tabla de Porcentajes</h3>
            <p className="text-xs text-slate-500 mb-3">1RM: {oneRepMax} {unit} · Toca una fila para ver los discos</p>
            <div className="space-y-1">
                {rows.map(({ pct, target, result }) => {
                    const isExpanded = expandedRow === pct;
                    const actual = result?.actual ?? 0;
                    const plates = result?.plates ?? {};
                    const hasPlates = Object.keys(plates).length > 0;

                    return (
                        <div key={pct}>
                            <button
                                onClick={() => setExpandedRow(isExpanded ? null : pct)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors ${
                                    isExpanded ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-750'
                                }`}
                            >
                                <span className={`font-semibold w-12 text-left ${isExpanded ? 'text-emerald-400' : 'text-cyan-400'}`}>{pct}%</span>
                                <span className="text-slate-400">{target.toFixed(1)} {unit}</span>
                                <span className="font-mono text-white">{actual.toFixed(1)} {unit}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
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
