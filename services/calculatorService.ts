
import { PlateCount, Rounding } from '../types';
import { OLYMPIC_PLATES_LBS } from '../constants';

/**
 * Calculates the exact plate combination for a given target weight.
 * @param targetWeightLbs The desired total weight on the bar in pounds.
 * @param barWeightLbs The weight of the barbell in pounds.
 * @param rounding The rounding strategy to use.
 * @returns An object with the target weight, actual achievable weight, and the plate combination.
 */
export const calculatePlatesForTarget = (
    targetWeightLbs: number,
    barWeightLbs: number,
    rounding: Rounding
): { target: number; actual: number; plates: PlateCount } | null => {
    
    const smallestIncrement = OLYMPIC_PLATES_LBS[OLYMPIC_PLATES_LBS.length - 1] * 2; // e.g., 1.25 * 2 = 2.5 lbs

    let roundedTarget = targetWeightLbs;
    if (rounding === 'down') {
        roundedTarget = Math.floor(targetWeightLbs / smallestIncrement) * smallestIncrement;
    } else if (rounding === 'up') {
        roundedTarget = Math.ceil(targetWeightLbs / smallestIncrement) * smallestIncrement;
    } else { // 'nearest'
        roundedTarget = Math.round(targetWeightLbs / smallestIncrement) * smallestIncrement;
    }

    let totalPlateWeightNeeded = roundedTarget - barWeightLbs;

    if (totalPlateWeightNeeded < 0) {
        totalPlateWeightNeeded = 0; // Can't have negative plate weight
        roundedTarget = barWeightLbs;
    }

    let weightPerSide = totalPlateWeightNeeded / 2;
    const platesResult: PlateCount = {};
    let actualWeightPerSide = 0;

    // Use a greedy algorithm to find the plate combination
    for (const plateWeight of OLYMPIC_PLATES_LBS) {
        if (weightPerSide >= plateWeight) {
            const numPlates = Math.floor(weightPerSide / plateWeight);
            platesResult[plateWeight] = numPlates;
            weightPerSide -= numPlates * plateWeight;
            actualWeightPerSide += numPlates * plateWeight;
        }
    }

    const actualTotalWeight = barWeightLbs + (actualWeightPerSide * 2);

    return {
        target: targetWeightLbs,
        actual: actualTotalWeight,
        plates: platesResult,
    };
};
