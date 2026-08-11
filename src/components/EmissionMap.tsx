import React, { useEffect, useRef, useState, useMemo } from 'react';
import { EmissionData } from '@/types/carbon';
import { cn } from '@/lib/utils';

interface EmissionMapProps {
  data: EmissionData[];
  className?: string;
}

const categoryColors: Record<string, string> = {
  energy: '#3b82f6',
  fuel: '#f97316',
  travel: '#22c55e',
  other: '#8b5cf6',
};

export const EmissionMap: React.FC<EmissionMapProps> = ({ data, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ map: any; L: any } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const filteredData = selectedCategory
    ? data.filter((d) => d.category === selectedCategory)
    : data;

  const mapPoints = useMemo(() => filteredData
    .filter((d) => d.latitude && d.longitude)
    .map((d) => ({
      lat: d.latitude!,
      lng: d.longitude!,
      intensity: Math.min(d.co2Kg / 500, 1),
      category: d.category,
      value: d.co2Kg,
      location: d.location || 'Unknown',
      description: d.description,
    })), [filteredData]);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;
      await import('leaflet/dist/leaflet.css');
      await import('leaflet.heat');

      if (!mapRef.current) return;

      const map = (L as any).map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      (L as any).tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = { map, L };
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current?.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const { map, L } = mapInstanceRef.current;

    // Remove existing markers and heat layers
    map.eachLayer((layer: any) => {
      if (layer._latlng || layer._heat) {
        map.removeLayer(layer);
      }
    });

    // Add markers
    mapPoints.forEach((point) => {
      const marker = (L as any).circleMarker([point.lat, point.lng], {
        radius: Math.max(8, Math.min(20, point.value / 50)),
        fillColor: categoryColors[point.category] || '#8b5cf6',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
      }).addTo(map);

      const color = categoryColors[point.category] || '#8b5cf6';
      marker.bindPopup(`<div style="min-width:150px"><strong>${point.location}</strong><br/><small>${point.description}</small><br/><span style="color:${color}">${point.category}</span><br/><b>${point.value.toLocaleString()} kg CO₂</b></div>`);
    });

    // Add heat layer
    if (mapPoints.length > 0) {
      const heatData = mapPoints.map((p) => [p.lat, p.lng, p.intensity]);
      (L as any).heatLayer(heatData, { 
        radius: 25, 
        blur: 15, 
        maxZoom: 10, 
        gradient: { 0.2: '#22c55e', 0.4: '#84cc16', 0.6: '#facc15', 0.8: '#f97316', 1.0: '#ef4444' } 
      }).addTo(map);
      
      const bounds = (L as any).latLngBounds(mapPoints.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [isMapReady, mapPoints]);

  const categories = ['energy', 'fuel', 'travel', 'other'];

  return (
    <div id="gis-map" className={cn('glass-card rounded-xl overflow-hidden', className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Global Emission Map</h3>
            <p className="text-sm text-muted-foreground">Geographic distribution of carbon emissions</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setSelectedCategory(null)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80')}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize', selectedCategory === cat ? 'text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80')} style={{ backgroundColor: selectedCategory === cat ? categoryColors[cat] : undefined }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>
      <div ref={mapRef} className="h-[400px] w-full bg-muted" />
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Heat:</span>
            <div className="flex h-2 rounded-full overflow-hidden"><div className="w-4 bg-[#22c55e]" /><div className="w-4 bg-[#facc15]" /><div className="w-4 bg-[#ef4444]" /></div>
          </div>
          <span className="text-muted-foreground">{mapPoints.length} locations</span>
        </div>
      </div>
    </div>
  );
};
