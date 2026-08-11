import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { calculateRenewableMetrics } from '@/lib/environmentalCalculator';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Sun, CheckCircle, Info, Landmark } from 'lucide-react';

const COLORS = ['#eab308', '#3b82f6', '#10b981', '#06b6d4'];

const RenewableEnergy: React.FC = () => {
  const { environmentalData } = useEnvironmental();
  const metrics = calculateRenewableMetrics(environmentalData);

  const breakdownData = [
    { name: 'Solar', value: metrics.breakdown.solar },
    { name: 'Wind', value: metrics.breakdown.wind },
    { name: 'Biomass', value: metrics.breakdown.biomass },
    { name: 'Hydropower', value: metrics.breakdown.hydro }
  ].filter(d => d.value > 0);

  const comparisonData = [
    { name: 'Energy Source', Renewable: metrics.renewableKwh, Conventional: metrics.conventionalKwh }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Renewable Energy Systems</h1>
        <p className="text-muted-foreground">Model clean energy adoption factors, grid generation profiles, and offset carbon offsets.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Current Clean Mix"
          value={Math.round(metrics.currentPercentage)}
          unit="%"
          icon={<Sun className="w-5 h-5 text-amber-500" />}
          variant="success"
        />
        <StatCard
          title="Renewable Power"
          value={Math.round(metrics.renewableKwh)}
          unit="kWh"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          variant="success"
        />
        <StatCard
          title="CO₂ Saved"
          value={Math.round(metrics.co2SavedKg)}
          unit="kg"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          variant="success"
        />
        <StatCard
          title="Target Mix"
          value={metrics.targetPercentage}
          unit="%"
          icon={<Landmark className="w-5 h-5 text-blue-500" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Renewable Source Composition</CardTitle>
            <CardDescription>Breakdown of clean power sources (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {breakdownData.length === 0 ? (
              <p className="text-muted-foreground">No clean energy records found.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Conventional vs Renewable Share</CardTitle>
            <CardDescription>Overall breakdown of utility grid dependency (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip />
                <Legend />
                <Bar dataKey="Renewable" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Conventional" fill="#6b7280" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation Card */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardHeader className="flex flex-row items-center gap-3 py-4">
          <Info className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-sm font-semibold">Renewable Action Plan</CardTitle>
            <CardDescription>System suggestions based on site parameters</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">
            Current site renewable consumption is at <span className="font-semibold text-primary">{Math.round(metrics.currentPercentage)}%</span>. To meet the target threshold of <strong>{metrics.targetPercentage}%</strong>, we recommend installing rooftop Solar photovoltaic arrays, which can reduce conventional coal-fired grid energy dependencies and reduce carbon load by an estimated <strong>2,450 kg CO₂e</strong> annually.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RenewableEnergy;
