import React from 'react';
import { Unit, PlateCount } from '../types';
import { OLYMPIC_PLATES_LBS, OLYMPIC_PLATES_KG, KG_PER_LB } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlateIcon } from './ui/PlateIcon';

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

const WeightDisplay: React.FC<{ weightLbs: number; unit: Unit; label: string }> = ({ weightLbs, unit, label }) => {
    const displayWeight = unit === 'lbs' ? weightLbs : weightLbs * KG_PER_LB;
    return (
        <div className="text-center">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">{displayWeight.toFixed(2)}</span>
            <span className="text-sm text-slate-400 ml-1">{unit}</span>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
    );
};

export const Calculator: React.FC<CalculatorProps> = ({
    unit, setUnit, barWeightLbs, setBarWeightLbs, plates, setPlates, totalWeightLbs, onClearPlates
}) => {

    const platesToShow = unit === 'lbs' ? OLYMPIC_PLATES_LBS : OLYMPIC_PLATES_KG;

    const handleUnitChange = (newUnit: Unit) => {
        if (newUnit !== unit) {
            setPlates({});
            setUnit(newUnit);
        }
    };

    const handlePlateChange = (weight: number, change: number) => {
        setPlates(prev => {
            const newCount = (prev[weight] || 0) + change;
            const newPlates = { ...prev };
            if (newCount > 0) {
                newPlates[weight] = newCount;
            } else {
                delete newPlates[weight];
            }
            return newPlates;
        });
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

            <div className="grid grid-cols-3 gap-4 border-b border-slate-700 pb-4 mb-4">
                <WeightDisplay weightLbs={weightPerSideLbs} unit={unit} label="Peso por Lado" />
                <WeightDisplay weightLbs={totalWeightLbs} unit={unit} label="Peso Total" />
                <WeightDisplay weightLbs={barWeightLbs} unit={unit} label="Peso Barra" />
            </div>

            <div className="space-y-4">
                <div className="print:hidden">
                    <p className="text-sm font-medium text-slate-300 mb-2">Seleccionar Barra ({unit})</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant={barWeightLbs === 45 ? 'primary' : 'secondary'} onClick={() => setBarWeightLbs(45)}>45 lbs / 20.4 kg</Button>
                        <Button variant={barWeightLbs === 35 ? 'primary' : 'secondary'} onClick={() => setBarWeightLbs(35)}>35 lbs / 15.9 kg</Button>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-300 mb-2 print:text-black">Discos por Lado</p>
                    <div className="space-y-2">
                        {platesToShow.map(weight => (
                            <div key={weight} className="flex items-center justify-between bg-slate-800 p-2 rounded-lg print:bg-gray-100">
                                <div className="flex items-center gap-3">
                                    <PlateIcon weight={weight} />
                                    <span className="font-mono text-lg text-cyan-400 print:text-black">{weight} {unit}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handlePlateChange(weight, -1)} className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 text-xl flex items-center justify-center active:bg-slate-600 print:hidden">-</button>
                                    <span className="font-bold text-lg w-6 text-center">{plates[weight] || 0}</span>
                                    <button onClick={() => handlePlateChange(weight, 1)} className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 text-xl flex items-center justify-center active:bg-slate-600 print:hidden">+</button>
                                </div>
                            </div>
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