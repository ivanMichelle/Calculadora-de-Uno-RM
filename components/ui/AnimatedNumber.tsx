import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    decimals?: number;
    className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, decimals = 2, className = '' }) => {
    const [display, setDisplay] = useState(value);
    const [pop, setPop] = useState(false);
    const prevRef = useRef(value);

    useEffect(() => {
        const prev = prevRef.current;
        if (prev === value) return;

        prevRef.current = value;
        setPop(true);

        const diff = value - prev;
        const steps = 12;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            if (step >= steps) {
                setDisplay(value);
                clearInterval(timer);
                setTimeout(() => setPop(false), 200);
            } else {
                // Ease-out interpolation
                const t = step / steps;
                const eased = 1 - Math.pow(1 - t, 3);
                setDisplay(prev + diff * eased);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <span className={`${className} ${pop ? 'animate-number-pop' : ''}`}>
            {display.toFixed(decimals)}
        </span>
    );
};
