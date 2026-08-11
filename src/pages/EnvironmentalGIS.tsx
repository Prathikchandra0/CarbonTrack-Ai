import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useEnvironmental } from '@/context/EnvironmentalContext';
import { cn } from '@/lib/utils';

// Layer config
const LAYERS = [
  { id: 'carbon', label: 'Carbon Emissions', color: '#ef4444' },
  { id: 'water', label: 'Water Usage', color: '#3b82f6' },
  { id: 'waste', label: 'Waste Generated', color: '#f59e0b' },
  { id: 'renewable', label: 'Renewable Potential', color: '#10b981' },
  { id: 'risk', label: 'Environmental Risk', color: '#a855f7' }
];

const EnvironmentalGIS: React.FC = () => {
  const { environmentalData } = useEnvironmental();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ map: any; L: any } | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>('carbon');
  const [isMapReady, setIsMapReady] = useState(false);

  // Grouped points based on selected layer
  const mapPoints = useMemo(() => {
    return environmentalData
      .filter(d => d.latitude && d.longitude)
      .map(d => {
        let value = 0;
        let unit = '';
        let color = '#ef4444';
        
        switch (activeLayer) {
          case 'water':
            value = d.water_consumption || 0;
            unit = 'L';
            color = '#3b82f6';
            break;
          case 'waste':
            value = d.waste_generated || 0;
            unit = 'kg';
            color = '#f59e0b';
            break;
          case 'renewable':
            value = (d.renewable_energy || 0);
            unit = '%';
            color = '#10b981';
            break;
          case 'risk':
            value = (d.co2Kg > 2000 || (d.water_consumption && d.water_consumption > 15000)) ? 100 : 30;
            unit = 'Risk Index';
            color = '#a855f7';
            break;
          default:
            value = d.co2Kg;
            unit = 'kg CO2';
            color = '#ef4444';
            break;
        }

        return {
          lat: d.latitude!,
          lng: d.longitude!,
          value,
          unit,
          color,
          location: d.location || 'HQ Facility',
          description: d.description
        };
      }).filter(p => p.value > 0);
  }, [environmentalData, activeLayer]);

  // Leaflet map initialization
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;
      await import('leaflet/dist/leaflet.css');
      await import('leaflet.heat');

      if (!mapRef.current) return;

      const map = (L as any).map(mapRef.current, {
        center: [37.7749, -122.4194],
        zoom: 3,
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

  // Update map visual points when data or active layer changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const { map, L } = mapInstanceRef.current;

    // Remove existing layers
    map.eachLayer((layer: any) => {
      if (layer._latlng || layer._heat) {
        map.removeLayer(layer);
      }
    });

    // Add layers
    mapPoints.forEach(point => {
      const radiusSize = activeLayer === 'renewable' ? 12 : Math.max(8, Math.min(22, point.value / 1000));
      const marker = (L as any).circleMarker([point.lat, point.lng], {
        radius: radiusSize,
        fillColor: point.color,
        color: '#fff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.65
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width:140px; font-family:sans-serif;">
          <strong style="font-size:13px;">${point.location}</strong><br/>
          <span style="font-size:11px;color:#666;">${point.description}</span><br/>
          <span style="font-weight:bold;color:${point.color}; font-size:12px;">
            ${point.value.toLocaleString()} ${point.unit}
          </span>
        </div>
      `);
    });

    // Render Heatmap overlay for Carbon/Environmental risk
    if (mapPoints.length > 0) {
      const heatData = mapPoints.map(p => [p.lat, p.lng, 0.5]);
      (L as any).heatLayer(heatData, {
        radius: 30,
        blur: 18,
        maxZoom: 6
      }).addTo(map);

      const bounds = (L as any).latLngBounds(mapPoints.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [isMapReady, mapPoints, activeLayer]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">GIS Resource Planning Map</h1>
        <p className="text-muted-foreground">Spatial mapping and geospatial layers tracking carbon intensity, water usage stress, and waste accumulation zones.</p>
      </div>

      {/* Layer Controls */}
      <div className="flex items-center gap-2 flex-wrap bg-muted p-1.5 rounded-lg w-fit">
        {LAYERS.map(lay => (
          <button
            key={lay.id}
            onClick={() => setActiveLayer(lay.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all',
              activeLayer === lay.id
                ? 'bg-card text-foreground shadow-sm font-bold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {lay.label}
          </button>
        ))}
      </div>

      {/* Leaflet Frame */}
      <div className="relative rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        <div ref={mapRef} className="h-[480px] w-full z-10" />
        <div className="p-3 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>* Demo/Simulated spatial data coordinates.</span>
          <span>Active layer: <span className="font-semibold capitalize text-foreground">{activeLayer}</span></span>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalGIS;
