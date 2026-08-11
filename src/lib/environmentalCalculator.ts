import { EnvironmentalRecord, WaterMetrics, WasteMetrics, WasteToEnergyMetrics, RenewableEnergyMetrics, SustainabilityScoreBreakdown, SDGGoalProgress, AIMonitorRisk } from '@/types/environmental';
import { Recommendation } from '@/types/carbon';

// 1. Water Metrics Calculator
export function calculateWaterMetrics(data: EnvironmentalRecord[]): WaterMetrics {
  let totalUsed = 0;
  let totalSaved = 0;
  const records: Array<{ date: string; value: number; saved: number; type: string }> = [];

  data.forEach(r => {
    if (r.water_consumption) {
      totalUsed += r.water_consumption;
      totalSaved += r.water_saved || 0;
      records.push({
        date: r.date,
        value: r.water_consumption,
        saved: r.water_saved || 0,
        type: r.location || 'Unknown'
      });
    }
  });

  // Calculate monthly trend data
  const monthlyMap: Record<string, { consumption: number; saved: number }> = {};
  records.forEach(r => {
    const month = new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!monthlyMap[month]) {
      monthlyMap[month] = { consumption: 0, saved: 0 };
    }
    monthlyMap[month].consumption += r.value;
    monthlyMap[month].saved += r.saved;
  });

  const trends = Object.keys(monthlyMap).map(name => ({
    name,
    consumption: monthlyMap[name].consumption,
    saved: monthlyMap[name].saved
  }));

  const savingPercentage = totalUsed > 0 ? (totalSaved / (totalUsed + totalSaved)) * 100 : 0;
  const avgDaily = trends.length > 0 ? totalUsed / (trends.length * 30) : 0;

  return {
    totalUsed,
    totalSaved,
    savingPercentage,
    avgDaily,
    records,
    trends
  };
}

// 2. Waste Metrics Calculator
export function calculateWasteMetrics(data: EnvironmentalRecord[]): WasteMetrics {
  let totalGenerated = 0;
  let recycled = 0;
  let compostable = 0;

  const breakdown = {
    organic: 0,
    plastic: 0,
    paper: 0,
    glass: 0,
    metal: 0,
    eWaste: 0,
    other: 0
  };

  data.forEach(r => {
    if (r.waste_generated) {
      totalGenerated += r.waste_generated;
      recycled += r.waste_recycled || 0;
      compostable += r.organic_waste || 0;

      breakdown.organic += r.organic_waste || 0;
      breakdown.plastic += r.plastic_waste || 0;
      breakdown.paper += r.paper_waste || 0;
      breakdown.glass += r.glass_waste || 0;
      breakdown.metal += r.metal_waste || 0;
      breakdown.eWaste += r.e_waste || 0;

      const sumDeclared = (r.organic_waste || 0) + (r.plastic_waste || 0) + (r.paper_waste || 0) + (r.glass_waste || 0) + (r.metal_waste || 0) + (r.e_waste || 0);
      breakdown.other += Math.max(0, r.waste_generated - sumDeclared);
    }
  });

  const landfill = Math.max(0, totalGenerated - recycled);
  const recyclingPercentage = totalGenerated > 0 ? (recycled / totalGenerated) * 100 : 0;

  // Monthly trends
  const monthlyMap: Record<string, { generated: number; recycled: number }> = {};
  data.forEach(r => {
    if (r.waste_generated) {
      const month = new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthlyMap[month]) {
        monthlyMap[month] = { generated: 0, recycled: 0 };
      }
      monthlyMap[month].generated += r.waste_generated;
      monthlyMap[month].recycled += r.waste_recycled || 0;
    }
  });

  const trends = Object.keys(monthlyMap).map(name => ({
    name,
    generated: monthlyMap[name].generated,
    recycled: monthlyMap[name].recycled
  }));

  return {
    totalGenerated,
    recycled,
    landfill,
    compostable,
    recyclingPercentage,
    reductionPercentage: recyclingPercentage * 0.8, // estimated baseline reduction
    breakdown,
    trends
  };
}

// 3. Waste-to-Energy potential calculations
export function calculateWasteToEnergy(data: EnvironmentalRecord[]): WasteToEnergyMetrics {
  let totalOrganic = 0;
  data.forEach(r => {
    totalOrganic += r.organic_waste || 0;
  });

  // conversion factor: 0.75 kWh per kg organic waste
  const energyRecoveredKwh = totalOrganic * 0.75;
  // co2 reduction factor: 0.44 kg CO2e saved per kWh recovered
  const co2ReductionKg = energyRecoveredKwh * 0.44;

  const monthlyMap: Record<string, number> = {};
  data.forEach(r => {
    if (r.organic_waste) {
      const month = new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyMap[month] = (monthlyMap[month] || 0) + r.organic_waste;
    }
  });

  const monthlyRecovery = Object.keys(monthlyMap).map(name => {
    const org = monthlyMap[name];
    const nrg = org * 0.75;
    return {
      name,
      organic: org,
      energy: nrg,
      co2Saved: nrg * 0.44
    };
  });

  return {
    totalOrganic,
    energyRecoveredKwh,
    co2ReductionKg,
    monthlyRecovery
  };
}

// 4. Renewable Energy calculations
export function calculateRenewableMetrics(data: EnvironmentalRecord[]): RenewableEnergyMetrics {
  let totalEnergy = 0;
  let weightedRenewableSum = 0;
  let recordsCount = 0;

  data.forEach(r => {
    if (r.energy_consumption) {
      totalEnergy += r.energy_consumption;
      weightedRenewableSum += (r.renewable_energy || 0);
      recordsCount++;
    }
  });

  const currentPercentage = recordsCount > 0 ? weightedRenewableSum / recordsCount : 0;
  const targetPercentage = 70;
  const renewableKwh = totalEnergy * (currentPercentage / 100);
  const conventionalKwh = totalEnergy - renewableKwh;
  // Saving: 0.4 kg CO2 saved per kWh compared to grid (0.4 kg/kWh carbon reduction value)
  const co2SavedKg = renewableKwh * 0.4;

  // Breakdown of types of renewable sources (mock shares based on average clean mix)
  const breakdown = {
    solar: renewableKwh * 0.45,
    wind: renewableKwh * 0.35,
    biomass: renewableKwh * 0.12,
    hydro: renewableKwh * 0.08
  };

  return {
    currentPercentage,
    targetPercentage,
    totalGenerationKwh: renewableKwh,
    conventionalKwh,
    renewableKwh,
    co2SavedKg,
    breakdown
  };
}

// 5. Centralized Sustainability Score calculation
export function calculateSustainabilityScore(data: EnvironmentalRecord[]): SustainabilityScoreBreakdown {
  if (data.length === 0) {
    return { score: 50, carbon: 50, energy: 50, water: 50, waste: 50, renewables: 50, materials: 50, environment: 50 };
  }

  // Carbon rating: based on average carbon reduction target (e.g. lowering total carbon footprint)
  let totalCarbon = 0;
  data.forEach(r => totalCarbon += r.co2Kg);
  const carbonScore = Math.max(20, Math.min(100, 100 - (totalCarbon / (data.length * 500)) * 20));

  // Energy rating
  let totalEnergy = 0;
  data.forEach(r => totalEnergy += r.energy_consumption || 0);
  const energyScore = Math.max(30, Math.min(100, 100 - (totalEnergy / (data.length * 1000)) * 10));

  // Water rating
  const waterMetrics = calculateWaterMetrics(data);
  const waterScore = Math.max(30, Math.min(100, 50 + waterMetrics.savingPercentage * 1.2));

  // Waste rating
  const wasteMetrics = calculateWasteMetrics(data);
  const wasteScore = Math.max(20, Math.min(100, 40 + wasteMetrics.recyclingPercentage * 1.2));

  // Renewables rating
  const renewMetrics = calculateRenewableMetrics(data);
  const renewablesScore = Math.max(10, Math.min(100, renewMetrics.currentPercentage * 1.3));

  // Materials rating (mock/constant baseline for average sustainable materials use)
  const materialsScore = 75;

  // Environmental rating (mock / tree planting conservation rating)
  const environmentScore = 65;

  // Weighted average: Carbon 20%, Energy 15%, Water 15%, Waste 15%, Renewables 15%, Materials 10%, Environment 10%
  const score = Math.round(
    carbonScore * 0.20 +
    energyScore * 0.15 +
    waterScore * 0.15 +
    wasteScore * 0.15 +
    renewablesScore * 0.15 +
    materialsScore * 0.10 +
    environmentScore * 0.10
  );

  return {
    score,
    carbon: Math.round(carbonScore),
    energy: Math.round(energyScore),
    water: Math.round(waterScore),
    waste: Math.round(wasteScore),
    renewables: Math.round(renewablesScore),
    materials: Math.round(materialsScore),
    environment: Math.round(environmentScore)
  };
}

// 6. SDG goals mapping
export function calculateSDGScores(data: EnvironmentalRecord[]): SDGGoalProgress[] {
  const scores = calculateSustainabilityScore(data);
  const renew = calculateRenewableMetrics(data);
  const waste = calculateWasteMetrics(data);
  const water = calculateWaterMetrics(data);

  return [
    {
      id: 7,
      title: 'Affordable and Clean Energy',
      progress: Math.round(renew.currentPercentage / 0.7), // mapping target of 70% as 100% completion
      description: 'Promote energy efficiency and adoption of renewable sources.',
      contribution: ['Renewable energy monitoring', 'Energy efficiency analytics', 'Solar/Wind adoption recommendations']
    },
    {
      id: 11,
      title: 'Sustainable Cities and Communities',
      progress: Math.round((scores.carbon + scores.environment) / 2),
      description: 'Reduce environmental impacts in urban centers via monitoring and GIS planning.',
      contribution: ['GIS environmental planning maps', 'Carbon hotspot tracking', 'Urban resource planning']
    },
    {
      id: 12,
      title: 'Responsible Consumption & Production',
      progress: Math.round(waste.recyclingPercentage),
      description: 'Promote waste reduction, materials recovery, and circular practices.',
      contribution: ['Solid waste lifecycle tracking', 'Waste-to-energy conversion', 'Recyclable material analytics']
    },
    {
      id: 13,
      title: 'Climate Action',
      progress: Math.round(scores.carbon),
      description: 'Implement actions to mitigate emissions and manage environmental hazards.',
      contribution: ['Carbon footprint analytics', 'Emission predictive modeling', 'AI environmental monitoring']
    },
    {
      id: 15,
      title: 'Life on Land',
      progress: Math.round(scores.environment),
      description: 'Conserve and protect terrestrial ecosystems and foster environmental awareness.',
      contribution: ['Eco-conservation indicators', 'Soil/forest/biodiversity awareness content', 'Educational training modules']
    }
  ];
}

// 7. Statistical AI Monitor / Anomaly Detection
export function detectAnomalies(data: EnvironmentalRecord[]): Record<string, AIMonitorRisk> {
  const water = calculateWaterMetrics(data);
  const waste = calculateWasteMetrics(data);
  const renew = calculateRenewableMetrics(data);

  // Check water anomaly
  let waterRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let waterExpl = 'Water consumption is in alignment with seasonal benchmarks.';
  let waterRec = 'Continue standard leakage audits.';
  
  if (water.trends.length >= 2) {
    const latest = water.trends[water.trends.length - 1].consumption;
    const prev = water.trends[water.trends.length - 2].consumption;
    const pctDiff = ((latest - prev) / prev) * 100;
    if (pctDiff > 25) {
      waterRisk = 'HIGH';
      waterExpl = `Water consumption surged by ${Math.round(pctDiff)}% compared to the previous month.`;
      waterRec = 'Conduct an immediate inspection of piping and high-consumption zones for leaks.';
    } else if (pctDiff > 10) {
      waterRisk = 'MEDIUM';
      waterExpl = `Water usage rose by ${Math.round(pctDiff)}% over the baseline.`;
      waterRec = 'Remind facility users of conservation protocols.';
    }
  }

  // Check waste anomaly
  let wasteRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let wasteExpl = 'Waste output remains stable within expected recycling targets.';
  let wasteRec = 'Continue segregation enforcement.';

  if (waste.trends.length >= 2) {
    const latest = waste.trends[waste.trends.length - 1].generated;
    const prev = waste.trends[waste.trends.length - 2].generated;
    const pctDiff = ((latest - prev) / prev) * 100;
    if (pctDiff > 30) {
      wasteRisk = 'HIGH';
      wasteExpl = `Waste production rose by ${Math.round(pctDiff)}%, exceeding standard landfill caps.`;
      wasteRec = 'Improve source segregation, limit single-use plastics, and step up composting.';
    } else if (pctDiff > 15) {
      wasteRisk = 'MEDIUM';
      wasteExpl = `Waste generation is trending upward by ${Math.round(pctDiff)}%.`;
      wasteRec = 'Review sorting bins configuration.';
    }
  }

  // Check energy anomaly
  let energyRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let energyExpl = 'Grid energy loading is stable; clean energy fraction is normal.';
  let energyRec = 'Maintain scheduling of high load systems.';

  if (data.length >= 2) {
    const lastRec = data[data.length - 1];
    const prevRec = data[data.length - 2];
    if (lastRec.energy_consumption && prevRec.energy_consumption) {
      const diff = ((lastRec.energy_consumption - prevRec.energy_consumption) / prevRec.energy_consumption) * 100;
      if (diff > 20) {
        energyRisk = 'HIGH';
        energyExpl = `Power demand increased sharply by ${Math.round(diff)}% this billing period.`;
        energyRec = 'Verify if HVAC operations or cooling schedules require sensor recalibration.';
      } else if (diff > 10) {
        energyRisk = 'MEDIUM';
        energyExpl = `Grid utility loading rose by ${Math.round(diff)}%.`;
        energyRec = 'Implement energy-saving sleep cycles during off-hours.';
      }
    }
  }

  // Combined overall risk score
  let overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (waterRisk === 'HIGH' || wasteRisk === 'HIGH' || energyRisk === 'HIGH') {
    overallRisk = 'HIGH';
  } else if (waterRisk === 'MEDIUM' || wasteRisk === 'MEDIUM' || energyRisk === 'MEDIUM') {
    overallRisk = 'MEDIUM';
  }

  return {
    water: { status: waterRisk, value: `${Math.round(water.avgDaily)} L/day`, trend: 'up', explanation: waterExpl, recommendation: waterRec },
    waste: { status: wasteRisk, value: `${Math.round(waste.totalGenerated)} kg`, trend: 'up', explanation: wasteExpl, recommendation: wasteRec },
    energy: { status: energyRisk, value: `${Math.round(renew.totalGenerationKwh)} kWh`, trend: 'up', explanation: energyExpl, recommendation: energyRec },
    overall: { status: overallRisk, value: overallRisk, trend: 'stable', explanation: 'Summary assessment of environmental thresholds.', recommendation: 'Observe real-time thresholds.' }
  };
}

// 8. Advanced recommendations generator
export function generateEnvironmentalRecommendations(data: EnvironmentalRecord[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const water = calculateWaterMetrics(data);
  const waste = calculateWasteMetrics(data);
  const renew = calculateRenewableMetrics(data);

  if (water.savingPercentage < 15) {
    recs.push({
      id: 'water-rec-1',
      category: 'general',
      title: 'Upgrade to low-flow fixtures',
      description: 'Water consumption savings are below benchmark. Installing aerators can cut flow rates by 30%.',
      impactLevel: 'medium',
      potentialSavingKg: 120
    });
  }

  if (waste.recyclingPercentage < 50) {
    recs.push({
      id: 'waste-rec-1',
      category: 'general',
      title: 'Formulate organic composting program',
      description: 'Composting organic waste diverts material from landfills and lowers methane emissions.',
      impactLevel: 'high',
      potentialSavingKg: waste.breakdown.organic * 0.5
    });
  }

  if (renew.currentPercentage < 50) {
    recs.push({
      id: 'renew-rec-1',
      category: 'energy',
      title: 'Increase Solar PV Generation',
      description: 'Your renewable energy percentage is currently at ' + Math.round(renew.currentPercentage) + '%. Transitioning to solar could offset significant conventional power.',
      impactLevel: 'high',
      potentialSavingKg: renew.conventionalKwh * 0.4
    });
  }

  return recs;
}
