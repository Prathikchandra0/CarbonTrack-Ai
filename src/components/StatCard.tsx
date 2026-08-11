import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'primary' | 'energy' | 'fuel' | 'travel' | 'success';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-gradient-to-br from-primary to-carbon-green-light text-primary-foreground',
  energy: 'border-l-4 border-l-chart-energy',
  fuel: 'border-l-4 border-l-chart-fuel',
  travel: 'border-l-4 border-l-chart-travel',
  success: 'border-l-4 border-l-accent',
};

const iconContainerStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  energy: 'bg-chart-energy/20 text-chart-energy',
  fuel: 'bg-chart-fuel/20 text-chart-fuel',
  travel: 'bg-chart-travel/20 text-chart-travel',
  success: 'bg-accent/20 text-accent',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendLabel,
  variant = 'default',
}) => {
  const TrendIcon = trend ? (trend > 0 ? TrendingUp : TrendingDown) : Minus;
  const trendColor = trend
    ? trend > 0
      ? 'text-destructive'
      : 'text-accent'
    : 'text-muted-foreground';

  const isPrimary = variant === 'primary';

  return (
    <div
      className={cn(
        'stat-card rounded-xl transition-all duration-300 hover:shadow-medium',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}
          >
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={cn(
                'text-3xl font-bold tracking-tight',
                isPrimary ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span
                className={cn(
                  'text-sm font-medium',
                  isPrimary ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}
              >
                {unit}
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-xl',
            iconContainerStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>

      {(trend !== undefined || trendLabel) && (
        <div
          className={cn(
            'flex items-center gap-1.5 mt-4 pt-4 border-t',
            isPrimary ? 'border-primary-foreground/20' : 'border-border'
          )}
        >
          <TrendIcon className={cn('w-4 h-4', isPrimary ? 'text-primary-foreground/70' : trendColor)} />
          <span
            className={cn(
              'text-sm font-medium',
              isPrimary ? 'text-primary-foreground/70' : trendColor
            )}
          >
            {trend !== undefined && `${trend > 0 ? '+' : ''}${trend}%`}
          </span>
          {trendLabel && (
            <span
              className={cn(
                'text-sm',
                isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'
              )}
            >
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
