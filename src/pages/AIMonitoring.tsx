import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { detectAnomalies } from '@/lib/environmentalCalculator';
import { ShieldAlert, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

const AIMonitoring: React.FC = () => {
  const { environmentalData } = useEnvironmental();
  const risks = detectAnomalies(environmentalData);

  const getStatusColor = (status: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (status) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (status) {
      case 'HIGH': return <ShieldAlert className="w-5 h-5 text-destructive" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Environmental Monitoring
          </h1>
          <p className="text-muted-foreground">Statistical modeling, anomaly detection, and predictive audits of resource usage thresholds.</p>
        </div>
        <Badge variant={getStatusColor(risks.overall.status)} className="px-3 py-1 text-sm font-semibold">
          Overall Risk: {risks.overall.status}
        </Badge>
      </div>

      {/* Grid of Anomalies */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Energy */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Energy Anomaly</span>
              {getStatusIcon(risks.energy.status)}
            </div>
            <CardTitle className="text-2xl font-bold">{risks.energy.value}</CardTitle>
            <CardDescription className="text-xs">Power grid load audit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 text-xs">
              <strong>Observation:</strong> {risks.energy.explanation}
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs">
              <strong>Rec:</strong> {risks.energy.recommendation}
            </div>
          </CardContent>
        </Card>

        {/* Water */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Water Anomaly</span>
              {getStatusIcon(risks.water.status)}
            </div>
            <CardTitle className="text-2xl font-bold">{risks.water.value}</CardTitle>
            <CardDescription className="text-xs">Flow and consumption audit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 text-xs">
              <strong>Observation:</strong> {risks.water.explanation}
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs">
              <strong>Rec:</strong> {risks.water.recommendation}
            </div>
          </CardContent>
        </Card>

        {/* Waste */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Waste Anomaly</span>
              {getStatusIcon(risks.waste.status)}
            </div>
            <CardTitle className="text-2xl font-bold">{risks.waste.value}</CardTitle>
            <CardDescription className="text-xs">Solid waste volume audit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 text-xs">
              <strong>Observation:</strong> {risks.waste.explanation}
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs">
              <strong>Rec:</strong> {risks.waste.recommendation}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Anomaly Modeling Architecture</CardTitle>
          <CardDescription>Mathematical framework utilized to detect abnormal operational logs</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            The environmental monitoring system implements a <strong>Z-Score and Interquartile Range (IQR)</strong> statistical filter to establish baseline thresholds for operational parameters.
          </p>
          <p className="bg-muted p-3 rounded-lg font-mono text-xs">
            IQR = Q3 - Q1 <br />
            Lower Bound = Q1 - 1.5 * IQR <br />
            Upper Bound = Q3 + 1.5 * IQR
          </p>
          <p className="text-muted-foreground text-xs">
            Any values exceeding the Upper Bound or showing sudden standard deviations (&gt; 2σ) are flagged. This rules engine supports plugging in scikit-learn models (Isolation Forest / Random Forest) when migrating to a production cloud microservice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMonitoring;
