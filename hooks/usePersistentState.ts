import { useState, useEffect } from 'react';

/**
 * A custom React hook that persists state to localStorage.
 * @param key The key to use in localStorage.
 * @param defaultValue The default value to use if nothing is in localStorage.
 * @returns A stateful value, and a function to update it.
 */
function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            // If a value is stored, parse it. Otherwise, use the default.
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            // Whenever the state changes, save it to localStorage.
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
}

export default usePersistentState;
