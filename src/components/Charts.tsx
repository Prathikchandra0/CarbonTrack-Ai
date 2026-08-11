import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <div className={cn('glass-card rounded-xl p-6', className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {entry.value.toLocaleString()} kg CO₂
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface EmissionTrendChartProps {
  data: Array<{
    month: string;
    energy: number;
    fuel: number;
    travel: number;
    total: number;
  }>;
}

export const EmissionTrendChart: React.FC<EmissionTrendChartProps> = ({ data }) => {
  return (
    <ChartCard
      title="Emission Trends"
      subtitle="Monthly breakdown by category"
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="travelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(145, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="energy"
              name="Energy"
              stroke="hsl(200, 70%, 50%)"
              fill="url(#energyGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="fuel"
              name="Fuel"
              stroke="hsl(25, 95%, 53%)"
              fill="url(#fuelGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="travel"
              name="Travel"
              stroke="hsl(145, 60%, 45%)"
              fill="url(#travelGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

interface PredictionChartProps {
  data: Array<{
    month: string;
    actual?: number;
    predicted: number;
    lower?: number;
    upper?: number;
  }>;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data }) => {
  return (
    <ChartCard
      title="AI Predictions"
      subtitle="Future emission forecast with confidence intervals"
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--accent))', r: 4 }}
            />
            {data.some(d => d.lower !== undefined) && (
              <>
                <Line
                  type="monotone"
                  dataKey="upper"
                  name="Upper Bound"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  name="Lower Bound"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

interface CategoryBreakdownProps {
  data: {
    energy: number;
    fuel: number;
    travel: number;
    other: number;
  };
}

const COLORS = [
  'hsl(200, 70%, 50%)',
  'hsl(25, 95%, 53%)',
  'hsl(145, 60%, 45%)',
  'hsl(270, 50%, 60%)',
];

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
  const pieData = [
    { name: 'Energy', value: data.energy },
    { name: 'Fuel', value: data.fuel },
    { name: 'Travel', value: data.travel },
    { name: 'Other', value: data.other },
  ].filter(d => d.value > 0);

  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartCard title="Category Breakdown" subtitle="Distribution of emissions by source">
      <div className="flex items-center gap-8">
        <div className="w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {pieData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {entry.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {((entry.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(entry.value / total) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};
