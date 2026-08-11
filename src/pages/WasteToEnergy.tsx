import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { calculateWasteToEnergy } from '@/lib/environmentalCalculator';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Flame, Info, CheckCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const WasteToEnergy: React.FC = () => {
  const { environmentalData } = useEnvironmental();
  const metrics = calculateWasteToEnergy(environmentalData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Waste-to-Energy (WtE) Potential</h1>
        <p className="text-muted-foreground">Model biogas yields, clean electrical capacity, and carbon offsets calculated from biodegradable solid waste stream profiles.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Organic Waste Managed"
          value={Math.round(metrics.totalOrganic)}
          unit="kg"
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
        <StatCard
          title="Estimated Energy Recovery"
          value={Math.round(metrics.energyRecoveredKwh)}
          unit="kWh (Est. Potential)"
          icon={<Flame className="w-5 h-5 text-amber-500" />}
          variant="energy"
        />
        <StatCard
          title="Potential CO₂ Reduction"
          value={Math.round(metrics.co2ReductionKg)}
          unit="kg CO₂e (Est. Potential)"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          variant="success"
        />
      </div>

      {/* Recovery Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Estimated Monthly Energy Recovery Potential</CardTitle>
          <CardDescription>Energy (kWh) and carbon offset (kg CO₂e) modeled monthly</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.monthlyRecovery}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="energy" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} name="Energy Potential (kWh)" />
              <Area type="monotone" dataKey="co2Saved" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="CO2 Saved (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Educational Center */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-base font-semibold">Waste-to-Energy Methodologies</CardTitle>
            <CardDescription>Learn about technologies converting urban solid waste streams into utility grid resources.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Anaerobic Digestion & Biogas Synthesis</AccordionTrigger>
              <AccordionContent>
                Anaerobic digestion utilizes bacterial cultures to break down organic wastes in oxygen-free reactors, yielding biogas (mostly methane and carbon dioxide). Biogas can fuel combined heat and power (CHP) generators.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Thermal Incineration with Heat Recovery</AccordionTrigger>
              <AccordionContent>
                High-temperature waste incinerators combust municipal waste, heating high-pressure boilers. The resulting steam powers turbine generators to supply electricity directly to the regional utility grid.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Landfill Gas (LFG) Capturing</AccordionTrigger>
              <AccordionContent>
                Decomposing landfill layers release landfill gas. Installing vertical extraction wells captures this gas, preventing emissions and providing fuel for onsite generation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteToEnergy;
