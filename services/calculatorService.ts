
import { PlateCount, Rounding, Unit } from '../types';
import { OLYMPIC_PLATES_LBS, OLYMPIC_PLATES_KG } from '../constants';

/**
 * Calculates the exact plate combination for a given target weight.
 * @param targetWeight The desired total weight on the bar.
 * @param barWeight The weight of the barbell.
 * @param unit The weight unit (lbs or kg).
 * @param rounding The rounding strategy to use.
 * @returns An object with the target weight, actual achievable weight, and the plate combination.
 */
export const calculatePlatesForTarget = (
    targetWeight: number,
    barWeight: number,
    unit: Unit,
    rounding: Rounding
): { target: number; actual: number; plates: PlateCount } | null => {
    
    const platesToUse = unit === 'lbs' ? OLYMPIC_PLATES_LBS : OLYMPIC_PLATES_KG;
    const smallestIncrement = platesToUse[platesToUse.length - 1] * 2; 

    let roundedTarget = targetWeight;
    if (rounding === 'down') {
        roundedTarget = Math.floor(targetWeight / smallestIncrement) * smallestIncrement;
    } else if (rounding === 'up') {
        roundedTarget = Math.ceil(targetWeight / smallestIncrement) * smallestIncrement;
    } else { // 'nearest'
        roundedTarget = Math.round(targetWeight / smallestIncrement) * smallestIncrement;
    }

    let totalPlateWeightNeeded = roundedTarget - barWeight;

    if (totalPlateWeightNeeded < 0) {
        totalPlateWeightNeeded = 0; 
        roundedTarget = barWeight;
    }

    let weightPerSide = totalPlateWeightNeeded / 2;
    const platesResult: PlateCount = {};
    let actualWeightPerSide = 0;

    // Use a greedy algorithm to find the plate combination
    for (const plateWeight of platesToUse) {
        if (weightPerSide >= plateWeight) {
            const numPlates = Math.floor(weightPerSide / plateWeight);
            platesResult[plateWeight] = numPlates;
            weightPerSide -= numPlates * plateWeight;
            actualWeightPerSide += numPlates * plateWeight;
        }
    }

    const actualTotalWeight = barWeight + (actualWeightPerSide * 2);

    return {
        target: targetWeight,
        actual: actualTotalWeight,
        plates: platesResult,
    };
};

/**
 * Validates if a string is a positive number.
 * @param value The string value to validate.
 * @returns An object with the parsed number or an error message.
 */
export const validatePositiveNumber = (value: string): { value: number | null; error?: string } => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
        return { value: null, error: "El campo es requerido." };
    }
    const num = parseFloat(trimmedValue);
    if (isNaN(num)) {
        return { value: null, error: "Debe ser un valor numérico." };
    }
    if (num <= 0) {
        return { value: null, error: "Debe ser un número positivo." };
    }
    return { value: num };
};
