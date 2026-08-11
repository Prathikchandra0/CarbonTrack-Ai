import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { EmissionData } from '@/types/carbon';
import { calculateCO2 } from './carbonCalculator';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

interface RawRecord {
  date?: string;
  Date?: string;
  DATE?: string;
  category?: string;
  Category?: string;
  CATEGORY?: string;
  type?: string;
  Type?: string;
  description?: string;
  Description?: string;
  DESCRIPTION?: string;
  value?: string | number;
  Value?: string | number;
  VALUE?: string | number;
  amount?: string | number;
  Amount?: string | number;
  unit?: string;
  Unit?: string;
  UNIT?: string;
  latitude?: string | number;
  Latitude?: string | number;
  lat?: string | number;
  Lat?: string | number;
  longitude?: string | number;
  Longitude?: string | number;
  lng?: string | number;
  Lng?: string | number;
  lon?: string | number;
  location?: string;
  Location?: string;
  energy_consumption?: string | number;
  renewable_energy?: string | number;
  water_consumption?: string | number;
  water_saved?: string | number;
  waste_generated?: string | number;
  waste_recycled?: string | number;
  organic_waste?: string | number;
  plastic_waste?: string | number;
  paper_waste?: string | number;
  glass_waste?: string | number;
  metal_waste?: string | number;
  e_waste?: string | number;
  [key: string]: unknown;
}

function normalizeCategory(cat: string): 'energy' | 'fuel' | 'travel' | 'other' {
  const normalized = cat.toLowerCase().trim();
  if (normalized.includes('energy') || normalized.includes('electric') || normalized.includes('power') || normalized.includes('gas')) {
    return 'energy';
  }
  if (normalized.includes('fuel') || normalized.includes('petrol') || normalized.includes('diesel') || normalized.includes('gasoline')) {
    return 'fuel';
  }
  if (normalized.includes('travel') || normalized.includes('transport') || normalized.includes('flight') || normalized.includes('car') || normalized.includes('commute')) {
    return 'travel';
  }
  return 'other';
}

function parseRow(row: any): any | null {
  const date = row.date || row.Date || row.DATE || new Date().toISOString().split('T')[0];
  const category = row.category || row.Category || row.CATEGORY || row.type || row.Type || 'other';
  const description = row.description || row.Description || row.DESCRIPTION || '';
  
  let value = parseFloat(String(row.value || row.Value || row.VALUE || row.amount || row.Amount || 0));
  const unit = row.unit || row.Unit || row.UNIT || 'kg CO2';
  
  const lat = parseFloat(String(row.latitude || row.Latitude || row.lat || row.Lat || ''));
  const lng = parseFloat(String(row.longitude || row.Longitude || row.lng || row.Lng || row.lon || ''));
  const location = row.location || row.Location || '';

  const energy = row.energy_consumption ? parseFloat(String(row.energy_consumption)) : 0;
  const water = row.water_consumption ? parseFloat(String(row.water_consumption)) : 0;
  const waste = row.waste_generated ? parseFloat(String(row.waste_generated)) : 0;
  const co2Val = row.co2_emissions || row.co2 || row.co2Kg || row.CO2 ? parseFloat(String(row.co2_emissions || row.co2 || row.co2Kg || row.CO2)) : 0;

  if (value === 0) {
    value = energy || water || waste || co2Val || 0;
  }

  if (isNaN(value) || (value === 0 && energy === 0 && water === 0 && waste === 0 && co2Val === 0)) return null;

  const normalizedCategory = normalizeCategory(category);
  
  let co2Kg = 0;
  if (co2Val > 0) {
    co2Kg = co2Val;
  } else {
    co2Kg = calculateCO2(normalizedCategory, value, unit);
  }

  return {
    id: generateId(),
    date: typeof date === 'string' ? date : new Date().toISOString().split('T')[0],
    category: normalizedCategory,
    description: String(description),
    value,
    unit: String(unit),
    co2Kg,
    latitude: !isNaN(lat) && lat !== 0 ? lat : undefined,
    longitude: !isNaN(lng) && lng !== 0 ? lng : undefined,
    location: location || undefined,
    energy_consumption: row.energy_consumption ? parseFloat(String(row.energy_consumption)) : undefined,
    renewable_energy: row.renewable_energy ? parseFloat(String(row.renewable_energy)) : undefined,
    water_consumption: row.water_consumption ? parseFloat(String(row.water_consumption)) : undefined,
    water_saved: row.water_saved ? parseFloat(String(row.water_saved)) : undefined,
    waste_generated: row.waste_generated ? parseFloat(String(row.waste_generated)) : undefined,
    waste_recycled: row.waste_recycled ? parseFloat(String(row.waste_recycled)) : undefined,
    organic_waste: row.organic_waste ? parseFloat(String(row.organic_waste)) : undefined,
    plastic_waste: row.plastic_waste ? parseFloat(String(row.plastic_waste)) : undefined,
    paper_waste: row.paper_waste ? parseFloat(String(row.paper_waste)) : undefined,
    glass_waste: row.glass_waste ? parseFloat(String(row.glass_waste)) : undefined,
    metal_waste: row.metal_waste ? parseFloat(String(row.metal_waste)) : undefined,
    e_waste: row.e_waste ? parseFloat(String(row.e_waste)) : undefined,
  };
}

export async function parseCSV(file: File): Promise<EmissionData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRecord>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .map(row => parseRow(row))
          .filter((d): d is EmissionData => d !== null);
        resolve(data);
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}

export async function parseExcel(file: File): Promise<EmissionData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<RawRecord>(firstSheet);
        
        const emissions = jsonData
          .map(row => parseRow(row))
          .filter((d): d is EmissionData => d !== null);
        
        resolve(emissions);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseFile(file: File): Promise<EmissionData[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') {
    return parseCSV(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file);
  } else {
    throw new Error('Unsupported file format. Please upload CSV or Excel files.');
  }
}
