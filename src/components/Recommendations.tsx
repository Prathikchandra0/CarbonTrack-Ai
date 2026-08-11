import React from 'react';
import { Lightbulb, Leaf, Car, Zap, Globe, ArrowRight } from 'lucide-react';
import { Recommendation } from '@/types/carbon';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const categoryIcons = {
  energy: Zap,
  fuel: Car,
  travel: Globe,
  general: Leaf,
};

const impactColors = {
  high: 'bg-accent text-accent-foreground',
  medium: 'bg-earth-amber text-foreground',
  low: 'bg-muted text-muted-foreground',
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
}) => {
  const Icon = categoryIcons[recommendation.category];

  return (
    <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:shadow-medium group">
      <div className="flex items-start gap-4">
        <div className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
          'transition-colors duration-300'
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground line-clamp-2">
              {recommendation.title}
            </h4>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
                impactColors[recommendation.impactLevel]
              )}
            >
              {recommendation.impactLevel} impact
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {recommendation.description}
          </p>
          {recommendation.potentialSavingKg > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                Save up to {Math.round(recommendation.potentialSavingKg).toLocaleString()} kg CO₂
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return (
      <div id="insights" className="glass-card rounded-xl p-8 text-center">
        <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground">
          No recommendations yet
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Upload your emission data to receive personalized sustainability tips.
        </p>
      </div>
    );
  }

  return (
    <div id="insights" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Sustainability Recommendations
          </h3>
          <p className="text-sm text-muted-foreground">
            Personalized actions to reduce your carbon footprint
          </p>
        </div>
        <div className="flex items-center gap-2 text-accent">
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-medium">{recommendations.length} tips</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
};
