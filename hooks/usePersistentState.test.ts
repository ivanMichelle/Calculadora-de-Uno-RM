
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePersistentState from './usePersistentState';

describe('usePersistentState', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with default value if localStorage is empty', () => {
        const { result } = renderHook(() => usePersistentState('test-key', 'default'));
        expect(result.current[0]).toBe('default');
    });

    it('should initialize with value from localStorage if it exists', () => {
        window.localStorage.setItem('test-key', JSON.stringify('stored-value'));
        const { result } = renderHook(() => usePersistentState('test-key', 'default'));
        expect(result.current[0]).toBe('stored-value');
    });

    it('should update localStorage when state changes', () => {
        const { result } = renderHook(() => usePersistentState('test-key', 'default'));
        
        act(() => {
            result.current[1]('new-value');
        });

        expect(result.current[0]).toBe('new-value');
        expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });

    it('should handle JSON parse errors gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        window.localStorage.setItem('test-key', 'invalid-json');
        
        const { result } = renderHook(() => usePersistentState('test-key', 'default'));
        
        expect(result.current[0]).toBe('default');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
