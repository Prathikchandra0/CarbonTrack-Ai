import React from 'react';
import { EmissionData } from '@/types/carbon';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Zap, Car, Plane, HelpCircle } from 'lucide-react';

interface DataTableProps {
  data: EmissionData[];
  className?: string;
}

const categoryIcons = {
  energy: Zap,
  fuel: Car,
  travel: Plane,
  other: HelpCircle,
};

const categoryColors = {
  energy: 'bg-chart-energy/10 text-chart-energy border-chart-energy/20',
  fuel: 'bg-chart-fuel/10 text-chart-fuel border-chart-fuel/20',
  travel: 'bg-chart-travel/10 text-chart-travel border-chart-travel/20',
  other: 'bg-chart-other/10 text-chart-other border-chart-other/20',
};

export const DataTable: React.FC<DataTableProps> = ({ data, className }) => {
  if (data.length === 0) {
    return (
      <div className={cn('glass-card rounded-xl p-8 text-center', className)}>
        <p className="text-muted-foreground">No data to display. Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className={cn('glass-card rounded-xl overflow-hidden', className)}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Emission Records</h3>
        <p className="text-sm text-muted-foreground">{data.length} records uploaded</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">CO₂ (kg)</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 10).map((record) => {
              const Icon = categoryIcons[record.category];
              return (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'flex items-center gap-1.5 w-fit',
                        categoryColors[record.category]
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="capitalize">{record.category}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {record.description}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {record.value.toLocaleString()} {record.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-primary">
                      {record.co2Kg.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.location ? (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{record.location}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {data.length > 10 && (
        <div className="p-3 text-center text-sm text-muted-foreground border-t border-border">
          Showing 10 of {data.length} records
        </div>
      )}
    </div>
  );
};
