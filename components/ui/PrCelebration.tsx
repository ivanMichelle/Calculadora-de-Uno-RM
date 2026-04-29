import React, { useEffect, useState } from 'react';

interface PrCelebrationProps {
    show: boolean;
}

const CONFETTI_COLORS = ['bg-emerald-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-400'];

export const PrCelebration: React.FC<PrCelebrationProps> = ({ show }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-x-0 top-0 flex justify-center">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]} animate-confetti`}
                        style={{
                            position: 'absolute',
                            left: `${10 + Math.random() * 80}%`,
                            top: `${Math.random() * 30}%`,
                            animationDelay: `${Math.random() * 0.5}s`,
                        }}
                    />
                ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400 animate-number-pop">
                    🏆 ¡Nuevo PR!
                </p>
            </div>
        </div>
    );
};
