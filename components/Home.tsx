import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface HomeProps {
    onSelect: (view: 'calculator' | 'rm') => void;
}

export const Home: React.FC<HomeProps> = ({ onSelect }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    LiftCalc
                </h1>
                <p className="text-slate-400 mt-2 text-lg">Tu compañero de entrenamiento olímpico</p>
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
            
            <footer className="text-center pt-8">
                <p className="text-slate-500 text-sm">Diseñado para atletas de levantamiento olímpico.</p>
            </footer>
        </div>
    );
};
