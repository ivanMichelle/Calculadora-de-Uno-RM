
import { describe, it, expect } from 'vitest';
import { calculatePlatesForTarget } from './calculatorService';

describe('calculatePlatesForTarget', () => {
    const barWeightLbs = 45;
    const barWeightKg = 20;

    it('should calculate correct plates for a target weight in lbs (nearest)', () => {
        const target = 225;
        const result = calculatePlatesForTarget(target, barWeightLbs, 'lbs', 'nearest');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.actual).toBe(225);
            expect(result.plates[45]).toBe(2);
        }
    });

    it('should calculate correct plates for a target weight in kg (nearest)', () => {
        const target = 100;
        const result = calculatePlatesForTarget(target, barWeightKg, 'kg', 'nearest');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.actual).toBe(100);
            expect(result.plates[25]).toBe(1); // (100 - 20) / 2 = 40. 40 = 25 + 15
            expect(result.plates[15]).toBe(1);
        }
    });

    it('should round down correctly in kg', () => {
        const target = 101.1; // Smallest increment in kg is 0.5 (0.25 * 2)
        const result = calculatePlatesForTarget(target, barWeightKg, 'kg', 'down');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.actual).toBe(101);
        }
    });

    it('should round up correctly in lbs', () => {
        const target = 226; // Smallest increment in lbs is 2.5 (1.25 * 2)
        const result = calculatePlatesForTarget(target, barWeightLbs, 'lbs', 'up');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.actual).toBe(227.5);
        }
    });

    it('should handle target weight less than bar weight', () => {
        const target = 30;
        const result = calculatePlatesForTarget(target, barWeightLbs, 'lbs', 'nearest');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.actual).toBe(45);
            expect(Object.keys(result.plates).length).toBe(0);
        }
    });

    it('should use greedy algorithm correctly for complex weights', () => {
        const target = 185; // (185 - 45) / 2 = 70. 70 = 45 + 25
        const result = calculatePlatesForTarget(target, barWeightLbs, 'lbs', 'nearest');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.actual).toBe(185);
            expect(result.plates[45]).toBe(1);
            expect(result.plates[25]).toBe(1);
        }
    });
});
