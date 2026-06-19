export type TransportMode = 'car' | 'bus' | 'metro' | 'bike' | 'cycle';
export type WasteHabit = 'high_waste' | 'mixed_recycler' | 'zero_waste';

export interface CarbonInputData {
  transport_mode: TransportMode;
  transport_distance: number; // km/day
  ac_hours: number; // hrs/day
  laptop_hours: number; // hrs/day
  waste_habit: WasteHabit;
  digital_hours: number; // hrs/day
}

export interface MetricCardData {
  co2Daily: number; // kg
  co2SavedPercent: number; // e.g. -8%
  ecoScore: number; // 0-100
  streak: number; // days
  savedCo2Kg: number; // kg saved overall
}

export interface CarbonPrediction {
  year: number;
  probability: number; // environmental risk score 0-100%
  description: string;
}
