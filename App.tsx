import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Unit, PlateCount, Rounding } from './types';
import { KG_PER_LB } from './constants';
import { calculatePlatesForTarget, validatePositiveNumber } from './services/calculatorService';
import { Home } from './components/Home';
import { Calculator } from './components/Calculator';
import { RmCalculator } from './components/RmCalculator';
import { EstimateRm } from './components/EstimateRm';
import { PwaPrompt } from './components/PwaPrompt';
import { Button } from './components/ui/Button';
import usePersistentState from './hooks/usePersistentState';

type View = 'index' | 'calculator' | 'rm' | 'estimate';

const VIEW_TITLES: Record<View, string> = {
    index: '',
    calculator: 'Carga de Barra',
    rm: '% de 1RM',
    estimate: 'Estimar 1RM',
};

const App: React.FC = () => {
    const [view, setView] = useState<View>('index');
    const [errors, setErrors] = useState<{ rm?: string; percentage?: string }>({});

    const [unit, setUnit] = usePersistentState<Unit>('unit', 'lbs');
    const [barWeightLbs, setBarWeightLbs] = usePersistentState<number>('barWeight', 45);
    const [plates, setPlates] = usePersistentState<PlateCount>('plates', {});
    const [oneRepMax, setOneRepMax] = usePersistentState<string>('oneRepMax', '');
    const [percentage, setPercentage] = usePersistentState<string>('percentage', '85');
    const [rounding, setRounding] = usePersistentState<Rounding>('rounding', 'nearest');

    const [rmResult, setRmResult] = useState<{ target: number; actual: number; plates: PlateCount } | null>(null);

    const totalWeightLbs = useMemo(() => {
        const platesWeight = Object.keys(plates).reduce((acc, weightKey) => {
            const weight = Number(weightKey);
            const count = plates[weight];
            return acc + (weight * count * 2);
        }, 0);
        return barWeightLbs + platesWeight;
    }, [barWeightLbs, plates]);

    const handleRmCalculate = useCallback(() => {
        const rmValidation = validatePositiveNumber(oneRepMax);
        const percValidation = validatePositiveNumber(percentage);

        const newErrors: { rm?: string; percentage?: string } = {};
        if (rmValidation.error) newErrors.rm = rmValidation.error;
        if (percValidation.error) newErrors.percentage = percValidation.error;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setRmResult(null);
            return;
        }

        const rm = rmValidation.value!;
        const perc = percValidation.value!;

        const targetWeight = rm * (perc / 100);
        const barWeight = unit === 'kg' ? barWeightLbs * KG_PER_LB : barWeightLbs;
        const result = calculatePlatesForTarget(targetWeight, barWeight, unit, rounding);
        setRmResult(result);
    }, [oneRepMax, percentage, unit, barWeightLbs, rounding]);

    useEffect(() => {
        if (view === 'rm' && oneRepMax && percentage) {
            handleRmCalculate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, barWeightLbs, rounding, unit, oneRepMax, percentage]);

    const handleClearPlates = () => setPlates({});

    const handleClearRm = () => {
        setOneRepMax('');
        setPercentage('85');
        setRounding('nearest');
        setErrors({});
        setRmResult(null);
    };

    const handleUseEstimate = (estimate: number) => {
        setOneRepMax(estimate.toString());
        setView('rm');
    };

    const handleBack = () => setView('index');

    return (
        <div className="min-h-screen bg-slate-900 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+80px)]">
            <main className="container mx-auto max-w-2xl p-4 md:p-6 space-y-6">
                {view === 'index' ? (
                    <Home onSelect={setView} />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" onClick={handleBack} className="!p-2 !rounded-full w-10 h-10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </Button>
                            <h1 className="text-2xl font-bold text-white">{VIEW_TITLES[view]}</h1>
                        </div>

                        {view === 'calculator' && (
                            <Calculator
                                unit={unit} setUnit={setUnit}
                                barWeightLbs={barWeightLbs} setBarWeightLbs={setBarWeightLbs}
                                plates={plates} setPlates={setPlates}
                                totalWeightLbs={totalWeightLbs}
                                onClearPlates={handleClearPlates}
                            />
                        )}

                        {view === 'rm' && (
                            <RmCalculator
                                unit={unit} setUnit={setUnit}
                                oneRepMax={oneRepMax} setOneRepMax={setOneRepMax}
                                percentage={percentage} setPercentage={setPercentage}
                                rounding={rounding} setRounding={setRounding}
                                rmResult={rmResult}
                                barWeightLbs={barWeightLbs} setBarWeightLbs={setBarWeightLbs}
                                errors={errors} setErrors={setErrors}
                                onClear={handleClearRm}
                            />
                        )}

                        {view === 'estimate' && (
                            <EstimateRm unit={unit} onUseEstimate={handleUseEstimate} />
                        )}
                    </div>
                )}
            </main>

            <PwaPrompt />
        </div>
    );
};

export default App;
