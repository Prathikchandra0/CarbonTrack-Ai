import { EmissionData } from './carbon';

export interface EnvironmentalRecord extends EmissionData {
  energy_consumption?: number; // kWh
  renewable_energy?: number; // %
  water_consumption?: number; // Liters
  water_saved?: number; // Liters
  waste_generated?: number; // kg
  waste_recycled?: number; // kg
  organic_waste?: number; // kg
  plastic_waste?: number; // kg
  paper_waste?: number; // kg
  glass_waste?: number; // kg
  metal_waste?: number; // kg
  e_waste?: number; // kg
}

export interface WaterMetrics {
  totalUsed: number;
  totalSaved: number;
  savingPercentage: number;
  avgDaily: number;
  records: Array<{ date: string; value: number; saved: number; type: string }>;
  trends: Array<{ name: string; consumption: number; saved: number }>;
}

export interface WasteMetrics {
  totalGenerated: number;
  recycled: number;
  landfill: number;
  compostable: number;
  recyclingPercentage: number;
  reductionPercentage: number;
  breakdown: {
    organic: number;
    plastic: number;
    paper: number;
    glass: number;
    metal: number;
    eWaste: number;
    other: number;
  };
  trends: Array<{ name: string; generated: number; recycled: number }>;
}

export interface WasteToEnergyMetrics {
  totalOrganic: number;
  energyRecoveredKwh: number;
  co2ReductionKg: number;
  monthlyRecovery: Array<{ name: string; organic: number; energy: number; co2Saved: number }>;
}

export interface SustainableMaterial {
  name: string;
  category: 'construction' | 'packaging' | 'manufacturing';
  co2Pct: number;
  recyclability: 'Low' | 'Medium' | 'High';
  durability: 'Low' | 'Medium' | 'High';
  impact: string;
  rating: number;
}

export interface RenewableEnergyMetrics {
  currentPercentage: number;
  targetPercentage: number;
  totalGenerationKwh: number;
  conventionalKwh: number;
  renewableKwh: number;
  co2SavedKg: number;
  breakdown: {
    solar: number;
    wind: number;
    biomass: number;
    hydro: number;
  };
}

export interface AIMonitorRisk {
  status: 'LOW' | 'MEDIUM' | 'HIGH';
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  explanation: string;
  recommendation: string;
}

export interface SDGGoalProgress {
  id: number;
  title: string;
  progress: number;
  description: string;
  contribution: string[];
}

export interface SustainabilityScoreBreakdown {
  score: number;
  carbon: number;
  energy: number;
  water: number;
  waste: number;
  renewables: number;
  materials: number;
  environment: number;
}
