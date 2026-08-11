import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SustainableMaterial } from '@/types/environmental';
import { Star, ArrowRightLeft, Leaf, Award } from 'lucide-react';

const materialDatabase: SustainableMaterial[] = [
  // Construction
  { name: 'Conventional Concrete', category: 'construction', co2Pct: 100, recyclability: 'Medium', durability: 'High', impact: 'High emission limestone processing', rating: 2.5 },
  { name: 'Low-Carbon Concrete', category: 'construction', co2Pct: 68, recyclability: 'High', durability: 'High', impact: 'Reduced binder emissions, recycled content', rating: 4.5 },
  { name: 'Fly-Ash Concrete', category: 'construction', co2Pct: 55, recyclability: 'Medium', durability: 'High', impact: 'Industrial byproduct composition', rating: 4.2 },
  { name: 'Recycled Aggregate Concrete', category: 'construction', co2Pct: 40, recyclability: 'High', durability: 'Medium', impact: 'Demolition waste recycling fraction', rating: 4.6 },
  
  // Packaging
  { name: 'Conventional Plastic', category: 'packaging', co2Pct: 100, recyclability: 'Low', durability: 'High', impact: 'Fossil hydrocarbon source material', rating: 1.5 },
  { name: 'Recycled Plastic (rPET)', category: 'packaging', co2Pct: 45, recyclability: 'High', durability: 'Medium', impact: 'Post-consumer polymer process', rating: 3.8 },
  { name: 'Bleached Kraft Paper', category: 'packaging', co2Pct: 35, recyclability: 'High', durability: 'Low', impact: 'Pulp forestry chemicals', rating: 3.5 },
  { name: 'Biodegradable PLA Packaging', category: 'packaging', co2Pct: 20, recyclability: 'High', durability: 'Low', impact: 'Cornstarch polylactide fermentation', rating: 4.8 },

  // Manufacturing
  { name: 'Virgin Aluminum', category: 'manufacturing', co2Pct: 100, recyclability: 'High', durability: 'High', impact: 'Extremely high bauxite electrolysis energy', rating: 2.2 },
  { name: 'Recycled Secondary Aluminum', category: 'manufacturing', co2Pct: 15, recyclability: 'High', durability: 'High', impact: 'Saves 95% process energy vs virgin smelting', rating: 4.9 },
  { name: 'Petrochemical Nylon 6', category: 'manufacturing', co2Pct: 100, recyclability: 'Low', durability: 'High', impact: 'Nitrous oxide process emissions', rating: 1.8 },
  { name: 'Bio-based Castor Nylon', category: 'manufacturing', co2Pct: 30, recyclability: 'High', durability: 'High', impact: 'Renewable plant cultivation base', rating: 4.4 }
];

const SustainableMaterials: React.FC = () => {
  const [catFilter, setCatFilter] = useState<'construction' | 'packaging' | 'manufacturing'>('construction');
  const [matA, setMatA] = useState<string>('Conventional Concrete');
  const [matB, setMatB] = useState<string>('Low-Carbon Concrete');

  const selectedMaterials = materialDatabase.filter(m => m.category === catFilter);
  
  const mInfoA = materialDatabase.find(m => m.name === matA) || materialDatabase[0];
  const mInfoB = materialDatabase.find(m => m.name === matB) || materialDatabase[1];

  const co2Saving = Math.max(0, mInfoA.co2Pct - mInfoB.co2Pct);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Sustainable Materials Database</h1>
        <p className="text-muted-foreground">Compare embodied carbon, recyclability, and ecological indicators across conventional and green replacement materials.</p>
      </div>

      {/* Category selector */}
      <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
        {(['construction', 'packaging', 'manufacturing'] as const).map(cat => (
          <Button
            key={cat}
            variant={catFilter === cat ? 'default' : 'ghost'}
            className="capitalize text-xs font-semibold"
            size="sm"
            onClick={() => {
              setCatFilter(cat);
              const list = materialDatabase.filter(m => m.category === cat);
              setMatA(list[0]?.name || '');
              setMatB(list[1]?.name || '');
            }}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Side by Side Comparative Tool */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-base font-semibold">Comparative Substitution Engine</CardTitle>
            <CardDescription>Select baseline and alternative materials to inspect footprint delta.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Baseline Material</Label>
              <Select value={matA} onValueChange={setMatA}>
                <SelectTrigger>
                  <SelectValue placeholder="Select baseline" />
                </SelectTrigger>
                <SelectContent>
                  {selectedMaterials.map(m => (
                    <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Proposed Substitute</Label>
              <Select value={matB} onValueChange={setMatB}>
                <SelectTrigger>
                  <SelectValue placeholder="Select substitution" />
                </SelectTrigger>
                <SelectContent>
                  {selectedMaterials.map(m => (
                    <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Metric Comparison Display */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Material A Card */}
            <div className="p-4 border rounded-xl bg-card">
              <h3 className="font-bold text-base mb-2">{mInfoA.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Embodied Carbon Footprint: <span className="text-foreground font-semibold">{mInfoA.co2Pct}%</span></p>
                <p>Recyclability index: <span className="text-foreground font-semibold">{mInfoA.recyclability}</span></p>
                <p>Durability: <span className="text-foreground font-semibold">{mInfoA.durability}</span></p>
                <p className="text-xs italic">Impact factor: {mInfoA.impact}</p>
                <div className="flex items-center gap-1">
                  <span>Rating:</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(mInfoA.rating) ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Material B Card */}
            <div className="p-4 border border-primary/30 rounded-xl bg-primary/5">
              <h3 className="font-bold text-base mb-2">{mInfoB.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Embodied Carbon Footprint: <span className="text-foreground font-semibold">{mInfoB.co2Pct}%</span></p>
                <p>Recyclability index: <span className="text-foreground font-semibold">{mInfoB.recyclability}</span></p>
                <p>Durability: <span className="text-foreground font-semibold">{mInfoB.durability}</span></p>
                <p className="text-xs italic">Impact factor: {mInfoB.impact}</p>
                <div className="flex items-center gap-1">
                  <span>Rating:</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(mInfoB.rating) ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Banner */}
          {co2Saving > 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <Leaf className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="font-semibold text-emerald-600 text-sm">Recommended Action: Switch to {mInfoB.name}</p>
                <p className="text-xs text-muted-foreground">Potential Embodied Carbon footprint reduction of <span className="font-bold text-emerald-600">{co2Saving}%</span> compared to utilizing {mInfoA.name}.</p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <p className="font-semibold text-amber-600 text-sm">Equivalent or higher footprint alternative.</p>
                <p className="text-xs text-muted-foreground">Consider selecting an alternative replacement with a lower carbon percentile metric.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainableMaterials;
