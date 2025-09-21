import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Unit, PlateCount, Rounding } from './types';
import { OLYMPIC_PLATES_LBS, KG_PER_LB } from './constants';
import { calculatePlatesForTarget } from './services/calculatorService';
import { Calculator } from './components/Calculator';
import { RmCalculator } from './components/RmCalculator';
import { PwaPrompt } from './components/PwaPrompt';
import usePersistentState from './hooks/usePersistentState';

const App: React.FC = () => {
    // State for input validation errors
    const [errors, setErrors] = useState<{ rm?: string; percentage?: string }>({});

    // Persisted state using the custom hook
    const [unit, setUnit] = usePersistentState<Unit>('unit', 'lbs');
    const [barWeightLbs, setBarWeightLbs] = usePersistentState<number>('barWeight', 45);
    const [plates, setPlates] = usePersistentState<PlateCount>('plates', { 45: 1 });
    const [oneRepMax, setOneRepMax] = usePersistentState<string>('oneRepMax', '');
    const [percentage, setPercentage] = usePersistentState<string>('percentage', '85');
    const [rounding, setRounding] = usePersistentState<Rounding>('rounding', 'nearest');
    
    // Non-persisted state for calculation results
    const [rmResult, setRmResult] = useState<{ target: number; actual: number; plates: PlateCount } | null>(null);

    // Calculate total weight based on bar and plates
    const totalWeightLbs = useMemo(() => {
        const platesWeight = Object.keys(plates).reduce((acc, weightKey) => {
            const weight = Number(weightKey);
            const count = plates[weight];
            return acc + (weight * count * 2);
        }, 0);
        return barWeightLbs + platesWeight;
    }, [barWeightLbs, plates]);

    // Refactored RM calculation logic with improved input validation
    const handleRmCalculate = useCallback(() => {
        const newErrors: { rm?: string; percentage?: string } = {};

        const validatePositiveNumber = (value: string, field: 'rm' | 'percentage'): number | null => {
            const trimmedValue = value.trim();
            if (trimmedValue === '') {
                newErrors[field] = "El campo es requerido.";
                return null;
            }
            const num = parseFloat(trimmedValue);
            if (isNaN(num)) {
                newErrors[field] = "Debe ser un valor numérico.";
                return null;
            }
            if (num <= 0) {
                newErrors[field] = "Debe ser un número positivo.";
                return null;
            }
            return num;
        };

        const rm = validatePositiveNumber(oneRepMax, 'rm');
        const perc = validatePositiveNumber(percentage, 'percentage');
        
        setErrors(newErrors);

        // Halt calculation if there are any validation errors
        if (Object.keys(newErrors).length > 0) {
            setRmResult(null);
            return;
        }

        // Ensure rm and perc are not null (TypeScript type guard)
        if (rm === null || perc === null) {
            setRmResult(null);
            return;
        }
        
        const targetWeightLbs = (unit === 'kg' ? rm / KG_PER_LB : rm) * (perc / 100);
        const result = calculatePlatesForTarget(targetWeightLbs, barWeightLbs, rounding);
        setRmResult(result);
    }, [oneRepMax, percentage, unit, barWeightLbs, rounding]);
    
    // Effect to auto-recalculate RM when inputs change (if a result is already shown)
    useEffect(() => {
        if (rmResult) {
            handleRmCalculate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barWeightLbs, rounding, unit]);


    const handlePrint = () => {
        window.print();
    };

    const handleClearPlates = () => {
        setPlates({});
    };

    return (
        <div className="min-h-screen bg-slate-900 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+80px)] print:pb-0">
            <main className="container mx-auto max-w-2xl p-4 md:p-6 space-y-6">
                <header className="text-center print:hidden">
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        Calculadora de Levantamientos
                    </h1>
                    <p className="text-slate-400 mt-1">Carga tu barra y calcula tu RM</p>
                </header>

                <div className="hidden print:block text-center mb-8">
                     <h1 className="text-2xl font-bold text-black">Resumen de Carga</h1>
                </div>

                <Calculator
                    unit={unit}
                    setUnit={setUnit}
                    barWeightLbs={barWeightLbs}
                    setBarWeightLbs={setBarWeightLbs}
                    plates={plates}
                    setPlates={setPlates}
                    totalWeightLbs={totalWeightLbs}
                    onPrint={handlePrint}
                    onClearPlates={handleClearPlates}
                />

                <RmCalculator
                    unit={unit}
                    oneRepMax={oneRepMax}
                    setOneRepMax={setOneRepMax}
                    percentage={percentage}
                    setPercentage={setPercentage}
                    rounding={rounding}
                    setRounding={setRounding}
                    rmResult={rmResult}
                    onCalculate={handleRmCalculate}
                    onPrint={handlePrint}
                    barWeightLbs={barWeightLbs}
                    errors={errors}
                    setErrors={setErrors}
                />
            </main>
            
            <PwaPrompt />
        </div>
    );
};

export default App;