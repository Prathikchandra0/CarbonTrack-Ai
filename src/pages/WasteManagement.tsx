import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { calculateWasteMetrics } from '@/lib/environmentalCalculator';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Trash2, Recycle, Compass } from 'lucide-react';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];

const WasteManagement: React.FC = () => {
  const { environmentalData } = useEnvironmental();
  const metrics = calculateWasteMetrics(environmentalData);

  const breakdownData = [
    { name: 'Organic', value: metrics.breakdown.organic },
    { name: 'Plastic', value: metrics.breakdown.plastic },
    { name: 'Paper', value: metrics.breakdown.paper },
    { name: 'Glass', value: metrics.breakdown.glass },
    { name: 'Metal', value: metrics.breakdown.metal },
    { name: 'E-Waste', value: metrics.breakdown.eWaste },
    { name: 'Other', value: metrics.breakdown.other }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Waste Management</h1>
        <p className="text-muted-foreground">Log solid waste streams, track materials recycling percentage, and optimize circular lifecycle pathways.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Waste Generated"
          value={Math.round(metrics.totalGenerated)}
          unit="kg"
          icon={<Trash2 className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Recycled Volume"
          value={Math.round(metrics.recycled)}
          unit="kg"
          icon={<Recycle className="w-5 h-5 text-emerald-500" />}
          variant="success"
        />
        <StatCard
          title="Recycling Rate"
          value={Math.round(metrics.recyclingPercentage)}
          unit="%"
          icon={<Compass className="w-5 h-5 text-emerald-500" />}
          variant="success"
        />
        <StatCard
          title="Landfill Diversion"
          value={Math.round(metrics.totalGenerated - metrics.landfill)}
          unit="kg"
          icon={<Recycle className="w-5 h-5 text-amber-500" />}
        />
      </div>

      {/* Breakdown Graphics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Waste Breakdown Category</CardTitle>
            <CardDescription>Composition of logged municipal waste (kg)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {breakdownData.length === 0 ? (
              <p className="text-muted-foreground">No waste metrics available.</p>
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
            <CardTitle className="text-base font-semibold">Generation vs Recycling Trends</CardTitle>
            <CardDescription>Monthly waste output analysis (kg)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="generated" fill="#f59e0b" name="Generated (kg)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recycled" fill="#10b981" name="Recycled (kg)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasteManagement;
