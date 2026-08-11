export interface EmissionData {
  id: string;
  date: string;
  category: 'energy' | 'fuel' | 'travel' | 'other';
  description: string;
  value: number;
  unit: string;
  co2Kg: number;
  latitude?: number;
  longitude?: number;
  location?: string;
}

export interface EmissionSummary {
  totalCO2: number;
  energyCO2: number;
  fuelCO2: number;
  travelCO2: number;
  otherCO2: number;
  recordCount: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface PredictionData {
  month: string;
  actual?: number;
  predicted: number;
  lower?: number;
  upper?: number;
}

export interface Recommendation {
  id: string;
  category: 'energy' | 'fuel' | 'travel' | 'general';
  title: string;
  description: string;
  impactLevel: 'high' | 'medium' | 'low';
  potentialSavingKg: number;
}

export interface MapPoint {
  lat: number;
  lng: number;
  intensity: number;
  category: string;
  value: number;
}

export interface UploadedFile {
  name: string;
  size: number;
  uploadedAt: Date;
  recordCount: number;
}
