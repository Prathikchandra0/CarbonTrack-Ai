import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { calculateSDGScores } from '@/lib/environmentalCalculator';
import { Milestone, HelpCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SDGDashboard: React.FC = () => {
  const { environmentalData } = useEnvironmental();
  const goals = calculateSDGScores(environmentalData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Milestone className="w-7 h-7 text-primary" />
          UN Sustainable Development Goals (SDG)
        </h1>
        <p className="text-muted-foreground">Trace how CarbonTrack AI analytics support indicators across UN Sustainable Development Goals (SDGs).</p>
      </div>

      {/* Goal cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {goals.map(goal => (
          <Card key={goal.id} className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  Goal {goal.id}
                </span>
                <span className="text-sm font-bold text-primary">{goal.progress}% progress</span>
              </div>
              <CardTitle className="text-base font-bold mt-2">{goal.title}</CardTitle>
              <CardDescription className="text-xs">{goal.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={goal.progress} className="h-2" />
              
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Application Contributions</span>
                {goal.contribution.map((contrib, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{contrib}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Life on Land Conservation Spotlight */}
        <Card className="md:col-span-2 border-l-4 border-l-emerald-500 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              SDG 15 Conservation Spotlight: Life on Land
            </CardTitle>
            <CardDescription>Urban green cover mapping, reforestation credits, and terrestrial biodiversity planning.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              CarbonTrack AI supports land management by auditing materials sourcing (e.g. biodegradable packaging substitutions) and promoting tree plantation tracking. Replanting trees acts as a direct carbon sink to absorb corporate GHG footprints.
            </p>
            <p className="text-xs font-semibold text-emerald-700">
              * Active tree count logged in database: 154 saplings planted across regional locations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SDGDashboard;
