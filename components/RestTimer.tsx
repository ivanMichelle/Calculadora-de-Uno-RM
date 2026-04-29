import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const PRESETS = [60, 90, 120, 180, 300];

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

export const RestTimer: React.FC = () => {
    const [duration, setDuration] = useState(90);
    const [remaining, setRemaining] = useState(0);
    const [running, setRunning] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const [customMinutes, setCustomMinutes] = useState('');
    const [customSeconds, setCustomSeconds] = useState('');
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setRunning(false);
        setRemaining(0);
    }, []);

    const start = useCallback((secs: number) => {
        stop();
        setDuration(secs);
        setRemaining(secs);
        setRunning(true);
    }, [stop]);

    useEffect(() => {
        if (!running) return;

        intervalRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    // Timer done
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
                    stop();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, stop]);

    const handleCustomStart = () => {
        const m = parseInt(customMinutes, 10) || 0;
        const s = parseInt(customSeconds, 10) || 0;
        const total = m * 60 + s;
        if (total > 0) {
            setShowCustom(false);
            start(total);
        }
    };

    const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Temporizador de Descanso</h3>

            {running ? (
                <div className="text-center space-y-3">
                    <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-700" />
                            <circle
                                cx="50" cy="50" r="45" fill="none" strokeWidth="4"
                                className="text-emerald-500"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white font-mono">{formatTime(remaining)}</span>
                        </div>
                    </div>
                    <Button onClick={stop} variant="secondary" className="w-full">Cancelar</Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {PRESETS.map(secs => (
                            <button
                                key={secs}
                                onClick={() => start(secs)}
                                className={`px-4 py-2 min-h-[44px] text-sm font-semibold rounded-lg transition-colors ${
                                    duration === secs && !running
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {formatTime(secs)}
                            </button>
                        ))}
                        <button
                            onClick={() => setShowCustom(!showCustom)}
                            className={`px-4 py-2 min-h-[44px] text-sm font-semibold rounded-lg transition-colors ${
                                showCustom ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            Otro
                        </button>
                    </div>
                    {showCustom && (
                        <div className="flex items-center gap-2 justify-center">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="min"
                                value={customMinutes}
                                onChange={e => setCustomMinutes(e.target.value)}
                                className="w-16 bg-slate-700 border border-slate-600 rounded-lg p-2 min-h-[44px] text-white text-center font-mono focus:ring-emerald-500 focus:border-emerald-500"
                                aria-label="Minutos"
                            />
                            <span className="text-slate-400 font-bold">:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="seg"
                                value={customSeconds}
                                onChange={e => setCustomSeconds(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCustomStart()}
                                className="w-16 bg-slate-700 border border-slate-600 rounded-lg p-2 min-h-[44px] text-white text-center font-mono focus:ring-emerald-500 focus:border-emerald-500"
                                aria-label="Segundos"
                            />
                            <Button onClick={handleCustomStart} className="!px-4">Iniciar</Button>
                        </div>
                    )}
                    {remaining === 0 && duration > 0 && (
                        <p className="text-xs text-slate-500 text-center">Toca un tiempo para iniciar</p>
                    )}
                </div>
            )}
        </Card>
    );
};
