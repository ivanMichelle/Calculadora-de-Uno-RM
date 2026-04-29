
import { useState, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [wakeLock, setWakeLock] = useState<any>(null);

    useEffect(() => {
        setIsSupported('wakeLock' in navigator);
    }, []);

    const requestWakeLock = useCallback(async () => {
        if (!isSupported) return;

        try {
            const lock = await (navigator as any).wakeLock.request('screen');
            setWakeLock(lock);
            setIsActive(true);

            lock.addEventListener('release', () => {
                setIsActive(false);
                setWakeLock(null);
            });
        } catch (err: any) {
            console.error(`${err.name}, ${err.message}`);
        }
    }, [isSupported]);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLock) {
            await wakeLock.release();
            setWakeLock(null);
            setIsActive(false);
        }
    }, [wakeLock]);

    // Handle visibility change (re-request if needed)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [wakeLock, requestWakeLock]);

    return { isSupported, isActive, requestWakeLock, releaseWakeLock };
};
