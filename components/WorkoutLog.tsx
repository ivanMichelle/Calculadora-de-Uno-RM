import React, { useState } from 'react';
import { WorkoutLogEntry, Unit } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import usePersistentState from '../hooks/usePersistentState';

interface WorkoutLogProps {
    unit: Unit;
    oneRepMax: string;
    percentage: string;
    actualWeight: number | null;
}

export const WorkoutLog: React.FC<WorkoutLogProps> = ({ unit, oneRepMax, percentage, actualWeight }) => {
    const [log, setLog] = usePersistentState<WorkoutLogEntry[]>('workoutLog', []);
    const [exercise, setExercise] = useState('');
    const [showAll, setShowAll] = useState(false);

    const EXERCISE_PRESETS = ['Sentadilla', 'Press Banca', 'Peso Muerto', 'Press Militar', 'Clean & Jerk', 'Snatch'];

    const canSave = actualWeight && actualWeight > 0 && exercise.trim() !== '';

    const handleSave = () => {
        if (!canSave) return;
        const entry: WorkoutLogEntry = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            date: new Date().toISOString(),
            exercise: exercise.trim(),
            oneRepMax: parseFloat(oneRepMax) || 0,
            percentage: parseFloat(percentage) || 0,
            actualWeight: actualWeight!,
            unit,
        };
        setLog(prev => [entry, ...prev]);
        setExercise('');
    };

    const handleDelete = (id: string) => {
        setLog(prev => prev.filter(e => e.id !== id));
    };

    const handleExport = () => {
        const data = JSON.stringify(log, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `liftcalc-log-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target?.result as string);
                    if (Array.isArray(imported)) {
                        setLog(prev => [...imported, ...prev]);
                    }
                } catch {
                    console.error('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const displayLog = showAll ? log : log.slice(0, 5);

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <Card className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Registro de Entrenamiento</h3>

            {actualWeight && actualWeight > 0 && (
                <div className="space-y-2 mb-4">
                    <div>
                        <label htmlFor="exercise-input" className="text-xs text-slate-400">Ejercicio</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                id="exercise-input"
                                type="text"
                                placeholder="Nombre del ejercicio"
                                value={exercise}
                                onChange={e => setExercise(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSave()}
                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-2 min-h-[44px] text-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <Button onClick={handleSave} disabled={!canSave} className="!px-4 text-sm">
                                Guardar
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {EXERCISE_PRESETS.map(name => (
                                <button
                                    key={name}
                                    onClick={() => setExercise(name)}
                                    className={`px-2 py-0.5 text-xs rounded-full transition-colors ${exercise === name ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {log.length > 0 ? (
                <>
                    <div className="space-y-1.5">
                        {displayLog.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between bg-slate-800 p-2.5 rounded-lg text-sm">
                                <div>
                                    <span className="font-semibold text-white">{entry.exercise}</span>
                                    <span className="text-slate-500 ml-2 text-xs">{formatDate(entry.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <span className="font-mono text-emerald-400">{entry.actualWeight.toFixed(1)} {entry.unit}</span>
                                        <span className="text-xs text-slate-500 ml-1">({entry.percentage}%)</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                                        aria-label={`Eliminar registro de ${entry.exercise}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {log.length > 5 && (
                        <button onClick={() => setShowAll(!showAll)} className="w-full mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                            {showAll ? 'Ver menos' : `Ver todos (${log.length})`}
                        </button>
                    )}

                    <div className="flex gap-2 mt-3">
                        <Button onClick={handleExport} variant="secondary" className="flex-1 text-xs">Exportar JSON</Button>
                        <Button onClick={handleImport} variant="secondary" className="flex-1 text-xs">Importar JSON</Button>
                    </div>
                </>
            ) : (
                <p className="text-sm text-slate-500 text-center py-2">Sin registros aún. Calcula un peso y guárdalo.</p>
            )}
        </Card>
    );
};
