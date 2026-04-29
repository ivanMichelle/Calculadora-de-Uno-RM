import React, { useState, useCallback } from 'react';
import { Unit, PlateCount } from '../types';
import { OLYMPIC_PLATES_LBS, OLYMPIC_PLATES_KG, KG_PER_LB } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlateIcon } from './ui/PlateIcon';
import { BarVisualization } from './ui/BarVisualization';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { PlateLegend } from './ui/PlateLegend';
import { useLongPress } from '../hooks/useLongPress';

interface CalculatorProps {
    unit: Unit;
    setUnit: (unit: Unit) => void;
    barWeightLbs: number;
    setBarWeightLbs: (weight: number) => void;
    plates: PlateCount;
    setPlates: (plates: PlateCount | ((prev: PlateCount) => PlateCount)) => void;
    totalWeightLbs: number;
    onClearPlates: () => void;
}

const AnimatedWeightDisplay: React.FC<{ weightLbs: number; unit: Unit; label: string }> = ({ weightLbs, unit, label }) => {
    const displayWeight = unit === 'lbs' ? weightLbs : weightLbs * KG_PER_LB;
    return (
        <div className="text-center">
            <AnimatedNumber value={displayWeight} className="text-2xl sm:text-3xl font-bold text-emerald-400" />
            <span className="text-sm text-slate-400 ml-1">{unit}</span>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
    );
};

const PRESET_BARS = [
    { lbs: 45, label: '45 lbs / 20.4 kg' },
    { lbs: 35, label: '35 lbs / 15.9 kg' },
    { lbs: 33, label: '33 lbs / 15 kg' },
    { lbs: 15, label: '15 lbs / 6.8 kg' },
];

const PlateRow: React.FC<{
    weight: number;
    count: number;
    unit: Unit;
    onAdd: () => void;
    onRemove: () => void;
}> = ({ weight, count, unit, onAdd, onRemove }) => {
    const subtotal = count * weight;
    const addProps = useLongPress(onAdd);
    const removeProps = useLongPress(onRemove);

    return (
        <div className="flex items-center justify-between bg-slate-800 p-2 rounded-lg print:bg-gray-100">
            <div className="flex items-center gap-3">
                <PlateIcon weight={weight} unit={unit} />
                <div>
                    <span className="font-mono text-lg text-cyan-400 print:text-black">{weight} {unit}</span>
                    {count > 0 && (
                        <span className="text-xs text-slate-500 ml-2">= {subtotal} {unit}/lado</span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    {...removeProps}
                    className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 text-xl flex items-center justify-center active:bg-slate-600 active:scale-90 transition-transform print:hidden select-none"
                    aria-label={`Quitar disco de ${weight} ${unit}`}
                >-</button>
                <span className={`font-bold text-lg w-6 text-center transition-all duration-150 ${count > 0 ? 'text-white scale-110' : 'text-slate-500'}`}>{count}</span>
                <button
                    {...addProps}
                    className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 text-xl flex items-center justify-center active:bg-slate-600 active:scale-90 transition-transform print:hidden select-none"
                    aria-label={`Agregar disco de ${weight} ${unit}`}
                >+</button>
            </div>
        </div>
    );
};

export const Calculator: React.FC<CalculatorProps> = ({
    unit, setUnit, barWeightLbs, setBarWeightLbs, plates, setPlates, totalWeightLbs, onClearPlates
}) => {
    const [showCustomBar, setShowCustomBar] = useState(false);
    const [customBarInput, setCustomBarInput] = useState('');

    const platesToShow = unit === 'lbs' ? OLYMPIC_PLATES_LBS : OLYMPIC_PLATES_KG;
    const isPresetBar = PRESET_BARS.some(b => b.lbs === barWeightLbs);

    const handleUnitChange = (newUnit: Unit) => {
        if (newUnit !== unit) {
            setPlates({});
            setUnit(newUnit);
        }
    };

    const handlePlateAdd = useCallback((weight: number) => {
        setPlates(prev => ({ ...prev, [weight]: (prev[weight] || 0) + 1 }));
    }, [setPlates]);

    const handlePlateRemove = useCallback((weight: number) => {
        setPlates(prev => {
            const current = prev[weight] || 0;
            if (current <= 1) {
                const next = { ...prev };
                delete next[weight];
                return next;
            }
            return { ...prev, [weight]: current - 1 };
        });
    }, [setPlates]);

    const handleCustomBarSubmit = () => {
        const val = parseFloat(customBarInput);
        if (!isNaN(val) && val > 0) {
            const lbsVal = unit === 'kg' ? val / KG_PER_LB : val;
            setBarWeightLbs(lbsVal);
            setShowCustomBar(false);
        }
    };

    const weightPerSideLbs = (totalWeightLbs - barWeightLbs) / 2;

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="text-xl font-semibold text-white">Carga de Barra</h2>
                <div className="flex gap-1 bg-slate-700 p-1 rounded-lg">
                    <Button variant={unit === 'lbs' ? 'primary' : 'secondary'} onClick={() => handleUnitChange('lbs')} className="!px-4 !py-1 text-sm">LBS</Button>
                    <Button variant={unit === 'kg' ? 'primary' : 'secondary'} onClick={() => handleUnitChange('kg')} className="!px-4 !py-1 text-sm">KG</Button>
                </div>
            </div>

            <BarVisualization plates={plates} unit={unit} />
            <PlateLegend unit={unit} />

            <div className="grid grid-cols-3 gap-4 border-b border-slate-700 pb-4 mb-4 mt-3">
                <AnimatedWeightDisplay weightLbs={weightPerSideLbs} unit={unit} label="Peso por Lado" />
                <AnimatedWeightDisplay weightLbs={totalWeightLbs} unit={unit} label="Peso Total" />
                <AnimatedWeightDisplay weightLbs={barWeightLbs} unit={unit} label="Peso Barra" />
            </div>

            <div className="space-y-4">
                <div className="print:hidden">
                    <p className="text-sm font-medium text-slate-300 mb-2">Seleccionar Barra</p>
                    <div className="grid grid-cols-2 gap-2">
                        {PRESET_BARS.map(bar => (
                            <Button key={bar.lbs} variant={barWeightLbs === bar.lbs ? 'primary' : 'secondary'} onClick={() => { setBarWeightLbs(bar.lbs); setShowCustomBar(false); }} className="text-sm">
                                {bar.label}
                            </Button>
                        ))}
                        <Button variant={!isPresetBar || showCustomBar ? 'primary' : 'secondary'} onClick={() => setShowCustomBar(!showCustomBar)} className="text-sm col-span-2">
                            Personalizada
                        </Button>
                    </div>
                    {showCustomBar && (
                        <div className="flex gap-2 mt-2">
                            <input type="number" min="0.01" step="any" placeholder={`Peso en ${unit}`} value={customBarInput} onChange={e => setCustomBarInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCustomBarSubmit()} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-2 min-h-[44px] text-white focus:ring-emerald-500 focus:border-emerald-500" aria-label={`Peso personalizado de barra en ${unit}`} />
                            <Button onClick={handleCustomBarSubmit} className="!px-4">OK</Button>
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-300 mb-2 print:text-black">Discos por Lado</p>
                    <div className="space-y-2">
                        {platesToShow.map(weight => (
                            <PlateRow
                                key={weight}
                                weight={weight}
                                count={plates[weight] || 0}
                                unit={unit}
                                onAdd={() => handlePlateAdd(weight)}
                                onRemove={() => handlePlateRemove(weight)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 justify-end print:hidden">
                <Button onClick={onClearPlates} variant="secondary" className="flex-grow sm:flex-grow-0">Limpiar Barra</Button>
            </div>
        </Card>
    );
};
