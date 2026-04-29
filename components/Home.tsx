import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useWakeLock } from '../hooks/useWakeLock';

interface HomeProps {
    onSelect: (view: 'calculator' | 'rm') => void;
}

export const Home: React.FC<HomeProps> = ({ onSelect }) => {
    const { isSupported: wakeLockSupported, isActive: wakeLockActive, requestWakeLock, releaseWakeLock } = useWakeLock();
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'LiftCalc - Calculadora de Levantamientos',
                    text: 'Calcula tu carga de barra y porcentajes de 1RM con LiftCalc.',
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    LiftCalc
                </h1>
                <p className="text-slate-400 mt-2 text-lg">Tu compañero de entrenamiento olímpico</p>
                {!isOnline && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                        Modo Offline Activo
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 gap-4">
                <Card className="hover:border-emerald-500/50 transition-colors cursor-pointer group" onClick={() => onSelect('calculator')}>
                    <div className="p-2">
                        <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">Carga de Barra</h2>
                        <p className="text-slate-400 mt-1">Calcula el peso total y los discos necesarios en tu barra.</p>
                        <div className="mt-4 flex justify-end">
                            <Button variant="primary" className="group-hover:scale-105 transition-transform">Comenzar</Button>
                        </div>
                    </div>
                </Card>

                <Card className="hover:border-cyan-500/50 transition-colors cursor-pointer group" onClick={() => onSelect('rm')}>
                    <div className="p-2">
                        <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">% de 1RM</h2>
                        <p className="text-slate-400 mt-1">Calcula porcentajes de tu repetición máxima y cómo cargar la barra.</p>
                        <div className="mt-4 flex justify-end">
                            <Button variant="primary" className="group-hover:scale-105 transition-transform">Comenzar</Button>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
                <div className="p-2 space-y-4">
                    <h3 className="text-lg font-semibold text-slate-300">Ajustes de App Móvil</h3>
                    
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-white">Mantener Pantalla Encendida</p>
                            <p className="text-xs text-slate-500">Evita que el móvil se bloquee mientras entrenas.</p>
                        </div>
                        {wakeLockSupported ? (
                            <button 
                                onClick={wakeLockActive ? releaseWakeLock : requestWakeLock}
                                role="switch"
                                aria-checked={wakeLockActive}
                                aria-label="Mantener pantalla encendida"
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${wakeLockActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${wakeLockActive ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        ) : (
                            <span className="text-xs text-slate-600">No soportado</span>
                        )}
                    </div>

                    {navigator.share && (
                        <div className="pt-2 border-t border-slate-700/50">
                            <Button variant="secondary" onClick={handleShare} className="w-full flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                                Compartir App
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
            
            <footer className="text-center pt-8">
                <p className="text-slate-500 text-sm">Diseñado para atletas de levantamiento olímpico.</p>
            </footer>
        </div>
    );
};
