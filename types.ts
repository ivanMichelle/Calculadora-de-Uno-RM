
export type Unit = 'lbs' | 'kg';
export type Rounding = 'down' | 'up' | 'nearest';
export type PlateCount = Record<number, number>; // key: plate weight, value: count per side

export interface WorkoutLogEntry {
    id: string;
    date: string;
    exercise: string;
    oneRepMax: number;
    percentage: number;
    actualWeight: number;
    unit: Unit;
}
