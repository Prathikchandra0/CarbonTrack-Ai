import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { calculateWaterMetrics } from '@/lib/environmentalCalculator';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Droplet, Award, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

const WaterManagement: React.FC = () => {
  const { environmentalData } = useEnvironmental();
  const metrics = calculateWaterMetrics(environmentalData);

  // Leakage/High consumption anomaly analysis
  const anomalies = [];
  if (metrics.trends.length >= 2) {
    const latest = metrics.trends[metrics.trends.length - 1].consumption;
    const prev = metrics.trends[metrics.trends.length - 2].consumption;
    const change = ((latest - prev) / prev) * 100;
    if (change > 20) {
      anomalies.push({
        title: 'High Water Consumption Warning',
        desc: `Water usage increased by ${Math.round(change)}% compared with the previous period.`,
        action: 'Recommended action: Inspect high-consumption areas and utility nodes for leakage patterns.'
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Water Resource Management</h1>
        <p className="text-muted-foreground">Monitor water consumption, analyze savings indicators, and audit conservation targets.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Water Consumption"
          value={Math.round(metrics.totalUsed)}
          unit="L"
          icon={<Droplet className="w-5 h-5 text-blue-500" />}
        />
        <StatCard
          title="Water Saved"
          value={Math.round(metrics.totalSaved)}
          unit="L"
          icon={<Droplet className="w-5 h-5 text-emerald-500" />}
          variant="success"
        />
        <StatCard
          title="Saving Percentage"
          value={Math.round(metrics.savingPercentage)}
          unit="%"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          variant="success"
        />
        <StatCard
          title="Average Daily Usage"
          value={Math.round(metrics.avgDaily)}
          unit="L/day"
          icon={<Sparkles className="w-5 h-5 text-blue-500" />}
        />
      </div>

      {/* Warnings & Anomalies */}
      {anomalies.map((a, i) => (
        <Card key={i} className="border-l-4 border-l-destructive bg-destructive/5">
          <CardHeader className="flex flex-row items-center gap-3 py-4">
            <ShieldAlert className="w-6 h-6 text-destructive" />
            <div>
              <CardTitle className="text-sm font-semibold">{a.title}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">{a.desc}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-foreground">{a.action}</p>
          </CardContent>
        </Card>
      ))}

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Water Usage Trends</CardTitle>
            <CardDescription>Monthly water consumption comparison (Liters)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="consumption" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} name="Consumption (L)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Water Savings Analysis</CardTitle>
            <CardDescription>Water volume conserved monthly (Liters)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="saved" fill="#10b981" name="Saved (L)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterManagement;
