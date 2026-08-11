import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle } from 'lucide-react';

const requirementsData = [
  { req: 'Environmental Sustainability', feature: 'Carbon, energy, water consumption, and solid waste stream tracking metrics.', status: 'Covered' },
  { req: 'Green Technologies', feature: 'Comparison database of green substitutes (low-carbon concrete, rPET, bio-based secondary aluminum).', status: 'Covered' },
  { req: 'AI Environmental Monitoring', feature: 'IQR/Z-Score mathematical threshold detector to flag abnormal operational utility spikes.', status: 'Covered' },
  { req: 'GIS Resource Planning', feature: 'Geospatial mapping layer controls showing spatial intensity distribution patterns.', status: 'Covered' },
  { req: 'Renewable Energy', feature: 'Solar, wind, biomass, and hydro composition tracking with carbon savings.', status: 'Covered' },
  { req: 'Waste Reduction', feature: 'Municipal waste metrics logs with circular recycling and compost rates.', status: 'Covered' },
  { req: 'Waste-to-Energy', feature: 'Methane/biogas energy yield modeling from organic waste fraction.', status: 'Covered' },
  { req: 'Sustainable Materials', feature: 'Embodied carbon percentile comparative tool for engineers.', status: 'Covered' },
  { req: 'Environmental Education', feature: 'Foundational course syllabus combined with an interactive sustainability quiz.', status: 'Covered' },
  { req: 'SDG 7, 11, 12, 13 and 15 Mapping', feature: 'Goal status progress bars mapped to resource metrics.', status: 'Covered' },
  { req: 'IoT Integration', feature: 'Excluded intentionally by prompt design.', status: 'Not Required' }
];

const poMapping = [
  { po: 'PO1: Engineering Knowledge', explanation: 'Applying thermodynamic conversion factors (biogas methane energy yields) and materials science lifecycle parameters to construct substitution recommenders.' },
  { po: 'PO2: Problem Analysis', explanation: 'Utilizing Z-score outlier equations to identify spikes or leakages in resource logs without relying on physical sensor hardware.' },
  { po: 'PO3: Design/Development of Solutions', explanation: 'Designing circular solid waste management models and clean solar PV offsets to reduce conventional carbon dependency.' },
  { po: 'PO5: Modern Tool Usage', explanation: 'Using modern Web technologies (React, Leaflet GIS, Recharts) to render resource footprints for spatial audits.' },
  { po: 'PO6: The Engineer and Society', explanation: 'Evaluating municipal waste recycling rates to comply with environmental regulations.' },
  { po: 'PO7: Environment and Sustainability', explanation: 'Demonstrating clean renewable utility options aligned with UN Sustainable Development Goals.' },
  { po: 'PO9: Individual and Team Work', explanation: 'Constructing modular layout architecture supporting multi-user data logs uploads.' },
  { po: 'PO11: Project Management and Finance', explanation: 'Evaluating conservation indicators that yield financial savings on utility bills.' },
  { po: 'PO12: Life-long Learning', explanation: 'Providing educational syllabus cards to increase long-term user sustainability awareness.' }
];

const Requirements: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Award className="w-7 h-7 text-primary" />
          Program Outcomes & Requirements Traceability
        </h1>
        <p className="text-muted-foreground">Trace page compliance with academic grading sheets, project requirements, and ABET Program Outcomes (POs).</p>
      </div>

      {/* Requirements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Requirements Mapping</CardTitle>
          <CardDescription>Direct matching of page modules to project guidelines.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requirement</TableHead>
                <TableHead>Implemented Solution</TableHead>
                <TableHead className="w-[100px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirementsData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-xs">{row.req}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.feature}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={row.status === 'Covered' ? 'success' : 'secondary'} className="text-[10px] font-bold">
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PO Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Program Outcomes (PO) Matrix</CardTitle>
          <CardDescription>Academic contribution of CarbonTrack AI elements towards professional outcomes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {poMapping.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start text-xs border-b border-border pb-3 last:border-0 last:pb-0">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-xs">{item.po}</p>
                <p className="text-muted-foreground mt-1 leading-relaxed">{item.explanation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Requirements;
