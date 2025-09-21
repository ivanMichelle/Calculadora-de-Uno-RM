import React from 'react';
import { Unit, Rounding, PlateCount } from '../types';
import { RM_PERCENTAGES, KG_PER_LB } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlateIcon } from './ui/PlateIcon';

interface RmCalculatorProps {
    unit: Unit;
    oneRepMax: string;
    setOneRepMax: (value: string) => void;
    percentage: string;
    setPercentage: (value: string) => void;
    rounding: Rounding;
    setRounding: (value: Rounding) => void;
    rmResult: { target: number; actual: number; plates: PlateCount } | null;
    onCalculate: () => void;
    onPrint: () => void;
    barWeightLbs: number;
    errors: { rm?: string; percentage?: string };
    setErrors: React.Dispatch<React.SetStateAction<{ rm?: string; percentage?: string }>>;
}

const RoundingOption: React.FC<{ value: Rounding; current: Rounding; onClick: (val: Rounding) => void; children: React.ReactNode }> = ({ value, current, onClick, children }) => (
    <button onClick={() => onClick(value)} className={`flex-1 min-h-[44px] px-2 py-2 text-xs sm:text-sm rounded-md transition-colors ${current === value ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
        {children}
    </button>
);


export const RmCalculator: React.FC<RmCalculatorProps> = ({
    unit, oneRepMax, setOneRepMax, percentage, setPercentage, rounding, setRounding, rmResult, onCalculate, onPrint, barWeightLbs, errors, setErrors
}) => {
    
    const rmInLbs = unit === 'kg' ? parseFloat(oneRepMax) / KG_PER_LB : parseFloat(oneRepMax);
    const perc = parseFloat(percentage);
    const targetWeightLbs = (rmInLbs && perc) ? rmInLbs * (perc/100) : 0;
    const targetDisplay = unit === 'lbs' ? targetWeightLbs : targetWeightLbs * KG_PER_LB;

    const rmInputClasses = `w-full mt-1 bg-slate-700 border rounded-lg p-3 min-h-[44px] text-white focus:ring-emerald-500 focus:border-emerald-500 print:border-gray-300 print:bg-white print:text-black ${
        errors.rm ? 'border-red-500' : 'border-slate-600'
    }`;
    const percentageInputClasses = `w-full mt-1 bg-slate-700 border rounded-lg p-3 min-h-[44px] text-white focus:ring-emerald-500 focus:border-emerald-500 print:border-gray-300 print:bg-white print:text-black ${
        errors.percentage ? 'border-red-500' : 'border-slate-600'
    }`;

    return (
        <Card>
             <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="text-xl font-semibold text-white">% de 1RM</h2>
             </div>
             <div className="hidden print:block mb-4">
                 <h2 className="text-xl font-semibold text-black">% de 1RM</h2>
             </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="rm-input" className="text-sm font-medium text-slate-300 print:text-black">1RM ({unit})</label>
                    <input 
                        id="rm-input" 
                        type="number" 
                        min="0.01"
                        step="any"
                        placeholder="e.g., 225" 
                        value={oneRepMax} 
                        onChange={e => {
                            setOneRepMax(e.target.value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.rm;
                                return newErrors;
                            });
                        }} 
                        className={rmInputClasses}
                        aria-invalid={!!errors.rm}
                        aria-describedby={errors.rm ? "rm-error" : undefined}
                    />
                    {errors.rm && <p id="rm-error" className="mt-1 text-sm text-red-400">{errors.rm}</p>}
                </div>
                <div>
                    <label htmlFor="percentage-input" className="text-sm font-medium text-slate-300 print:text-black">Porcentaje (%)</label>
                    <input 
                        id="percentage-input" 
                        type="number" 
                        min="0.01"
                        step="any"
                        placeholder="e.g., 85" 
                        value={percentage} 
                        onChange={e => {
                            setPercentage(e.target.value);
                             setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.percentage;
                                return newErrors;
                            });
                        }} 
                        className={percentageInputClasses}
                        aria-invalid={!!errors.percentage}
                        aria-describedby={errors.percentage ? "percentage-error" : undefined}
                    />
                    {errors.percentage && <p id="percentage-error" className="mt-1 text-sm text-red-400">{errors.percentage}</p>}
                </div>
            </div>

            <div className="mt-4 print:hidden">
                <p className="text-sm font-medium text-slate-300 mb-2">Preajustes</p>
                <div className="flex flex-wrap gap-2">
                    {RM_PERCENTAGES.map(p => (
                        <button key={p} onClick={() => setPercentage(p.toString())} className={`px-3 py-1 text-sm rounded-full transition-colors ${percentage === p.toString() ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                            {p}%
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                 <p className="text-sm font-medium text-slate-300 mb-2 print:text-black">Redondeo</p>
                 <div className="flex gap-2">
                     <RoundingOption value="down" current={rounding} onClick={setRounding}>Abajo</RoundingOption>
                     <RoundingOption value="nearest" current={rounding} onClick={setRounding}>Cercano</RoundingOption>
                     <RoundingOption value="up" current={rounding} onClick={setRounding}>Arriba</RoundingOption>
                 </div>
            </div>

            <div className="mt-6 print:hidden">
                <Button onClick={onCalculate} className="w-full">Calcular Carga</Button>
            </div>

            {rmResult && (
                <div className="mt-6 border-t border-slate-700 pt-6 print:border-t-2 print:border-gray-300">
                    <p className="text-center text-slate-400 print:text-gray-600">
                        Objetivo: <strong className="text-white print:text-black">{targetDisplay.toFixed(2)} {unit}</strong>
                    </p>
                    <div className="text-center mt-2">
                        <span className="text-3xl font-bold text-emerald-400 print:text-emerald-600">
                            {(unit === 'lbs' ? rmResult.actual : rmResult.actual * KG_PER_LB).toFixed(2)} {unit}
                        </span>
                        <p className="text-xs text-slate-500 uppercase tracking-wider print:text-gray-500">Peso Real en Barra</p>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-slate-300 text-center mb-2 print:text-black">Desglose de Discos por Lado</p>
                        {Object.keys(rmResult.plates).length > 0 ? (
                            <ul className="bg-slate-800 rounded-lg p-3 space-y-2 print:bg-gray-100">
                                {Object.entries(rmResult.plates).sort(([a], [b]) => Number(b) - Number(a)).map(([weight, count]) => (
                                    <li key={weight} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300 print:text-gray-700 font-semibold">{count} x</span>
                                        <div className="flex items-center gap-2">
                                            <PlateIcon weight={Number(weight)} className="w-6 h-6" />
                                            <span className="font-mono text-cyan-400 print:text-cyan-600 w-16 text-right">{weight} {unit}</span>
                                        </div>
                                    </li>
                                ))}
                                <li className="flex justify-between items-center text-sm pt-2 border-t border-slate-700 print:border-gray-300">
                                   <span className="text-slate-300 print:text-gray-700">Barra:</span>
                                   <span className="font-mono text-cyan-400 print:text-cyan-600">{unit === 'lbs' ? barWeightLbs.toFixed(2) : (barWeightLbs * KG_PER_LB).toFixed(2)} {unit}</span>
                                </li>
                            </ul>
                        ) : (
                            <p className="text-center text-slate-500 bg-slate-800 p-3 rounded-lg print:bg-gray-100">Solo la barra.</p>
                        )}
                    </div>
                     <div className="mt-6 flex justify-end print:hidden">
                        <Button onClick={onPrint}>Exportar PDF</Button>
                    </div>
                </div>
            )}
        </Card>
    );
};