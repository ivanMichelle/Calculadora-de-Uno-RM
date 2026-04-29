import { useRef, useCallback } from 'react';

/**
 * Hook that fires a callback repeatedly while a button is held down.
 * First fires after `delay` ms, then repeats every `interval` ms.
 */
export function useLongPress(callback: () => void, delay = 400, interval = 100) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = useCallback(() => {
        // Fire once immediately on press
        callback();
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(callback, interval);
        }, delay);
    }, [callback, delay, interval]);

    const stop = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
}
