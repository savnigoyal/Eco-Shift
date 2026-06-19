import { CarbonInputData } from '../types';

export const BASELINE_DAILY_CO2 = 18.5; // Average user baseline in kg

export function calculateCarbonStats(data: CarbonInputData) {
  // 1. Transport Emissions (kg CO2 per km)
  // Car: 0.18, Bus: 0.08, Metro: 0.04, Bike/Cycle: 0
  let transportFactor = 0;
  if (data.transport_mode === 'car') transportFactor = 0.18;
  else if (data.transport_mode === 'bus') transportFactor = 0.08;
  else if (data.transport_mode === 'metro') transportFactor = 0.04;
  
  const transportEmissions = data.transport_distance * transportFactor;

  // 2. Electricity
  // AC: 1.2 kg per hour, Laptop: 0.05 kg per hour
  const acEmissions = data.ac_hours * 1.2;
  const laptopEmissions = data.laptop_hours * 0.05;

  // 3. Diet
  // Vegan: 1.5 kg/day, Veg: 3.0 kg/day, Non-veg: 6.5 kg/day
  let dietEmissions = 6.5;
  if (data.diet_type === 'vegan') dietEmissions = 1.5;
  else if (data.diet_type === 'veg') dietEmissions = 3.0;

  // 4. Digital (Devices, Cloud, Streaming)
  // 0.1 kg per hour
  const digitalEmissions = data.digital_hours * 0.1;

  const totalEmissions = parseFloat((transportEmissions + acEmissions + laptopEmissions + dietEmissions + digitalEmissions).toFixed(1));

  // Eco Score: 100 - (totalEmissions / 25) * 100, clamped between 10 and 100
  // Low emissions (e.g. 3-4 kg) gets high score (90+), High emissions gets low score
  let ecoScore = Math.round(100 - (totalEmissions / 22) * 80);
  ecoScore = Math.max(10, Math.min(100, ecoScore));

  // Daily Saved CO2 compared to Baseline
  const dailySaved = parseFloat(Math.max(0, BASELINE_DAILY_CO2 - totalEmissions).toFixed(1));

  return {
    totalEmissions,
    ecoScore,
    dailySaved,
    transportEmissions: parseFloat(transportEmissions.toFixed(1)),
    electricityEmissions: parseFloat((acEmissions + laptopEmissions).toFixed(1)),
    dietEmissions: parseFloat(dietEmissions.toFixed(1)),
    digitalEmissions: parseFloat(digitalEmissions.toFixed(1)),
  };
}

export function computeRiskScore(data: CarbonInputData, year: number) {
  // Normalize components (0 to 1)
  const normDistance = Math.min(1, data.transport_distance / 80);
  const normAC = Math.min(1, data.ac_hours / 14);
  const dietImpact = data.diet_type === 'vegan' ? 0.25 : data.diet_type === 'veg' ? 0.55 : 1.0;
  const normDiet = Math.min(1, dietImpact);
  const normDigital = Math.min(1, data.digital_hours / 24);

  // Weighted sum
  const transportWeight = 0.42;
  const electricityWeight = 0.25;
  const foodWeight = 0.18;
  const digitalWeight = 0.15;

  const baseImpact = normDistance * transportWeight + normAC * electricityWeight + normDiet * foodWeight + normDigital * digitalWeight;

  // Year factor: 2025 has low risk factor (0), 2050 has high risk factor (1)
  const yearFactor = (year - 2025) / 25;

  // Combined score (0..100)
  const combined = Math.min(100, Math.max(5, baseImpact * 70 + yearFactor * 30));
  return parseFloat(combined.toFixed(1));
}
