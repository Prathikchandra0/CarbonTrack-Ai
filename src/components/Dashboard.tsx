import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { calculateSustainabilityScore, calculateWaterMetrics, calculateWasteMetrics, calculateWasteToEnergy, calculateRenewableMetrics } from '@/lib/environmentalCalculator';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { EmissionTrendChart, PredictionChart, CategoryBreakdown } from '@/components/Charts';
import { EmissionMap } from '@/components/EmissionMap';
import { RecommendationList } from '@/components/Recommendations';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileUpload } from '@/components/FileUpload';
import { parseFile } from '@/lib/fileParser';
import { useToast } from '@/hooks/use-toast';
import { calculateSummary, generatePredictions, generateRecommendations } from '@/lib/carbonCalculator';
import { Leaf, Zap, Droplet, Trash2, Sun, Sparkles, Award, TrendingDown, Flame } from 'lucide-react';
import { getMonthlyEnvironmentalTrends } from '@/data/environmentalData';

export const Dashboard: React.FC = () => {
  const { environmentalData, setEnvironmentalData, hasCustomData, setHasCustomData } = useEnvironmental();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const summary = calculateSummary(environmentalData);
  const predictions = generatePredictions(environmentalData);
  const recommendations = generateRecommendations(summary);

  // Advanced Environmental Metrics
  const scores = calculateSustainabilityScore(environmentalData);
  const water = calculateWaterMetrics(environmentalData);
  const waste = calculateWasteMetrics(environmentalData);
  const wte = calculateWasteToEnergy(environmentalData);
  const renew = calculateRenewableMetrics(environmentalData);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await parseFile(file);
      if (data.length === 0) {
        toast({
          title: 'No valid data found',
          description: 'The file appears to be empty or has invalid format.',
          variant: 'destructive',
        });
        return;
      }

      setEnvironmentalData(data);
      setHasCustomData(true);
      setShowUploadDialog(false);

      toast({
        title: 'Data uploaded successfully!',
        description: `Processed ${data.length} environmental records.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to process file',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyTrends = getMonthlyEnvironmentalTrends();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-carbon-green-light to-sky-teal p-8 md:p-12 text-primary-foreground shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-sm font-medium text-primary-foreground/80">AI-Powered Environmental intelligence</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Environmental Sustainability Portal
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/80 mb-6 max-w-2xl">
            Analyze carbon, energy, water, and waste cycles in real-time. Use predictive models, materials rating database, and GIS planning maps to support UN SDGs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setShowUploadDialog(true)}
              className="gap-2"
            >
              Upload Data Log
            </Button>
          </div>
        </div>
      </section>

      {/* KPI Section */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatCard
          title="Total CO₂ Emissions"
          value={Math.round(summary.totalCO2)}
          unit="kg"
          icon={<Leaf className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Energy Consumption"
          value={Math.round(environmentalData.reduce((acc, curr) => acc + (curr.energy_consumption || 0), 0))}
          unit="kWh"
          icon={<Zap className="w-5 h-5" />}
          variant="energy"
        />
        <StatCard
          title="Renewable Energy"
          value={Math.round(renew.currentPercentage)}
          unit="%"
          icon={<Sun className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Water Consumption"
          value={Math.round(water.totalUsed)}
          unit="L"
          icon={<Droplet className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Water Saved"
          value={Math.round(water.totalSaved)}
          unit="L"
          icon={<Droplet className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Waste Generated"
          value={Math.round(waste.totalGenerated)}
          unit="kg"
          icon={<Trash2 className="w-5 h-5" />}
          variant="fuel"
        />
        <StatCard
          title="Recycling Rate"
          value={Math.round(waste.recyclingPercentage)}
          unit="%"
          icon={<Trash2 className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Waste-to-Energy"
          value={Math.round(wte.energyRecoveredKwh)}
          unit="kWh"
          icon={<Flame className="w-5 h-5" />}
          variant="travel"
        />
        <StatCard
          title="GHG Reduction"
          value={Math.round(renew.co2SavedKg + wte.co2ReductionKg)}
          unit="kg CO₂e"
          icon={<TrendingDown className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Sustainability Score"
          value={scores.score}
          unit="/100"
          icon={<Award className="w-5 h-5" />}
          variant="primary"
        />
      </section>

      {/* Main Charts / GIS map row */}
      <section className="grid gap-6 lg:grid-cols-2">
        <EmissionTrendChart data={monthlyTrends} />
        <PredictionChart data={predictions} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmissionMap data={environmentalData} />
        </div>
        <CategoryBreakdown
          data={{
            energy: summary.energyCO2,
            fuel: summary.fuelCO2,
            travel: summary.travelCO2,
            other: summary.otherCO2,
          }}
        />
      </section>

      {/* Records Table */}
      <DataTable data={environmentalData} />

      {/* Action Insights */}
      <RecommendationList recommendations={recommendations} />

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Environmental Data</DialogTitle>
            <DialogDescription>
              Upload your CSV or Excel file containing resource usage metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
