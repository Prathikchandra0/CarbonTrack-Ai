import { EmissionData, EmissionSummary, PredictionData, Recommendation, MapPoint } from '@/types/carbon';

// Emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  electricity: 0.4, // kg CO2 per kWh (global average)
  naturalGas: 2.0, // kg CO2 per cubic meter
  gasoline: 2.31, // kg CO2 per liter
  diesel: 2.68, // kg CO2 per liter
  carTravel: 0.21, // kg CO2 per km (average car)
  flightDomestic: 0.255, // kg CO2 per km
  flightInternational: 0.195, // kg CO2 per km
  train: 0.041, // kg CO2 per km
  bus: 0.089, // kg CO2 per km
};

export function calculateCO2(category: string, value: number, unit: string): number {
  const normalizedCategory = category.toLowerCase();
  const normalizedUnit = unit.toLowerCase();

  // Energy calculations
  if (normalizedCategory === 'energy' || normalizedCategory === 'electricity') {
    if (normalizedUnit.includes('kwh')) {
      return value * EMISSION_FACTORS.electricity;
    }
    if (normalizedUnit.includes('m3') || normalizedUnit.includes('cubic')) {
      return value * EMISSION_FACTORS.naturalGas;
    }
  }

  // Fuel calculations
  if (normalizedCategory === 'fuel') {
    if (normalizedUnit.includes('liter') || normalizedUnit === 'l') {
      // Assume gasoline by default
      return value * EMISSION_FACTORS.gasoline;
    }
    if (normalizedUnit.includes('gallon')) {
      return value * 3.785 * EMISSION_FACTORS.gasoline;
    }
  }

  // Travel calculations
  if (normalizedCategory === 'travel') {
    if (normalizedUnit.includes('km')) {
      return value * EMISSION_FACTORS.carTravel;
    }
    if (normalizedUnit.includes('mile')) {
      return value * 1.609 * EMISSION_FACTORS.carTravel;
    }
  }

  // Default: return value as-is if already in kg CO2
  if (normalizedUnit.includes('kg') && normalizedUnit.includes('co2')) {
    return value;
  }

  // Fallback estimation
  return value * 0.5;
}

export function calculateSummary(data: EmissionData[]): EmissionSummary {
  const summary: EmissionSummary = {
    totalCO2: 0,
    energyCO2: 0,
    fuelCO2: 0,
    travelCO2: 0,
    otherCO2: 0,
    recordCount: data.length,
    dateRange: {
      start: '',
      end: '',
    },
  };

  if (data.length === 0) return summary;

  const dates = data.map(d => new Date(d.date)).filter(d => !isNaN(d.getTime()));
  if (dates.length > 0) {
    dates.sort((a, b) => a.getTime() - b.getTime());
    summary.dateRange.start = dates[0].toISOString().split('T')[0];
    summary.dateRange.end = dates[dates.length - 1].toISOString().split('T')[0];
  }

  data.forEach(record => {
    summary.totalCO2 += record.co2Kg;
    switch (record.category) {
      case 'energy':
        summary.energyCO2 += record.co2Kg;
        break;
      case 'fuel':
        summary.fuelCO2 += record.co2Kg;
        break;
      case 'travel':
        summary.travelCO2 += record.co2Kg;
        break;
      default:
        summary.otherCO2 += record.co2Kg;
    }
  });

  return summary;
}

export function generatePredictions(data: EmissionData[]): PredictionData[] {
  // Group data by month
  const monthlyData: Record<string, number> = {};
  
  data.forEach(record => {
    const date = new Date(record.date);
    if (!isNaN(date.getTime())) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + record.co2Kg;
    }
  });

  const sortedMonths = Object.keys(monthlyData).sort();
  const values = sortedMonths.map(m => monthlyData[m]);

  // Simple moving average for prediction
  const predictions: PredictionData[] = [];

  // Add historical data
  sortedMonths.forEach((month, i) => {
    predictions.push({
      month: formatMonth(month),
      actual: values[i],
      predicted: values[i],
    });
  });

  // Generate future predictions (3 months)
  if (values.length >= 2) {
    const avgGrowth = values.length >= 3 
      ? (values[values.length - 1] - values[0]) / (values.length - 1)
      : (values[1] - values[0]);
    
    const lastValue = values[values.length - 1] || 100;
    const lastDate = sortedMonths[sortedMonths.length - 1];
    
    for (let i = 1; i <= 3; i++) {
      const futureMonth = addMonths(lastDate, i);
      const predicted = Math.max(0, lastValue + avgGrowth * i * 0.8);
      predictions.push({
        month: formatMonth(futureMonth),
        predicted: Math.round(predicted * 10) / 10,
        lower: Math.round(predicted * 0.85 * 10) / 10,
        upper: Math.round(predicted * 1.15 * 10) / 10,
      });
    }
  }

  return predictions;
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function addMonths(monthStr: string, months: number): string {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1 + months);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function generateRecommendations(summary: EmissionSummary): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const total = summary.totalCO2;

  if (total === 0) {
    recommendations.push({
      id: 'welcome',
      category: 'general',
      title: 'Welcome! Upload your data to get started',
      description: 'Upload your energy, fuel, and travel data to receive personalized recommendations.',
      impactLevel: 'medium',
      potentialSavingKg: 0,
    });
    return recommendations;
  }

  // Energy recommendations
  if (summary.energyCO2 > total * 0.3) {
    recommendations.push({
      id: 'energy-1',
      category: 'energy',
      title: 'Switch to renewable energy sources',
      description: 'Consider switching to a green energy provider or installing solar panels. This could reduce your energy emissions by up to 80%.',
      impactLevel: 'high',
      potentialSavingKg: summary.energyCO2 * 0.7,
    });
    recommendations.push({
      id: 'energy-2',
      category: 'energy',
      title: 'Improve home insulation',
      description: 'Better insulation can reduce heating/cooling energy needs by 20-30%. Consider double-glazed windows and wall insulation.',
      impactLevel: 'medium',
      potentialSavingKg: summary.energyCO2 * 0.25,
    });
  }

  // Fuel recommendations
  if (summary.fuelCO2 > total * 0.2) {
    recommendations.push({
      id: 'fuel-1',
      category: 'fuel',
      title: 'Consider an electric or hybrid vehicle',
      description: 'Electric vehicles can reduce your transport emissions by 50-70% compared to conventional cars.',
      impactLevel: 'high',
      potentialSavingKg: summary.fuelCO2 * 0.6,
    });
    recommendations.push({
      id: 'fuel-2',
      category: 'fuel',
      title: 'Optimize driving habits',
      description: 'Eco-driving techniques like smooth acceleration and maintaining tire pressure can improve fuel efficiency by 15-20%.',
      impactLevel: 'medium',
      potentialSavingKg: summary.fuelCO2 * 0.15,
    });
  }

  // Travel recommendations
  if (summary.travelCO2 > total * 0.25) {
    recommendations.push({
      id: 'travel-1',
      category: 'travel',
      title: 'Choose trains over flights for short trips',
      description: 'Train travel produces up to 90% less CO2 than flying for distances under 500km.',
      impactLevel: 'high',
      potentialSavingKg: summary.travelCO2 * 0.5,
    });
    recommendations.push({
      id: 'travel-2',
      category: 'travel',
      title: 'Consider remote work or carpooling',
      description: 'Working from home 2 days a week can reduce commute emissions by 40%. Carpooling halves individual travel emissions.',
      impactLevel: 'medium',
      potentialSavingKg: summary.travelCO2 * 0.3,
    });
  }

  // General recommendations
  recommendations.push({
    id: 'general-1',
    category: 'general',
    title: 'Offset remaining emissions',
    description: 'Consider carbon offset programs for emissions you cannot reduce. Look for verified projects like reforestation or renewable energy.',
    impactLevel: 'low',
    potentialSavingKg: total * 0.1,
  });

  return recommendations.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.impactLevel] - order[b.impactLevel];
  });
}

export function generateMapPoints(data: EmissionData[]): MapPoint[] {
  return data
    .filter(d => d.latitude && d.longitude)
    .map(d => ({
      lat: d.latitude!,
      lng: d.longitude!,
      intensity: Math.min(d.co2Kg / 100, 1), // Normalize to 0-1
      category: d.category,
      value: d.co2Kg,
    }));
}
