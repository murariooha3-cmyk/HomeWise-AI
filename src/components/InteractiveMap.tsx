import React, { useEffect, useRef, useState } from 'react';
import { LocalityInfo, PropertyRecord } from '../types';
import { MapPin, Search, ExternalLink, ChevronRight, Layers, IndianRupee } from 'lucide-react';
import { formatIndianCurrency } from '../services/mlEngine';

interface InteractiveMapProps {
  localities: LocalityInfo[];
  properties: PropertyRecord[];
  onSelectLocality: (locality: LocalityInfo) => void;
  onPredictForLocality: (localityName: string) => void;
  selectedLocalityName?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  localities,
  properties,
  onSelectLocality,
  onPredictForLocality,
  selectedLocalityName
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [mapLoaded, setMapLoaded] = useState(false);

  const zones = ['All', 'East Bengaluru', 'South Bengaluru', 'North Bengaluru', 'West Bengaluru', 'Central Bengaluru'];

  const filteredLocalities = localities.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'All' || loc.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const activeLocality = localities.find(l => l.name === selectedLocalityName) || localities[0];

  useEffect(() => {
    // Check if Leaflet is loaded on window
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered at Bengaluru center
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.5946],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m: any) => map.removeLayer(m));
    markersRef.current = {};

    // Custom marker icons based on price tier
    localities.forEach(loc => {
      // Determine color based on median price:
      // High tier > 100L: violet/navy, Mid 65-100L: emerald, Accessible <65L: teal
      const markerColor = loc.medianPriceLakhs >= 120 
        ? '#6366f1' 
        : loc.medianPriceLakhs >= 70 
        ? '#059669' 
        : '#0d9488';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
          ">
            ₹
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon }).addTo(map);

      // Popup content
      const popupHtml = `
        <div style="padding: 12px; font-family: system-ui, sans-serif; min-width: 200px;">
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
            ${loc.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${loc.zone} · ${loc.count} dataset records
          </div>
          <div style="background-color: #f8fafc; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px;">
            <div style="font-size: 11px; color: #64748b;">Median Dataset Price</div>
            <div style="font-size: 15px; font-weight: 800; color: #059669;">
              ${formatIndianCurrency(loc.medianPriceLakhs)}
            </div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">
              ₹${loc.avgPricePerSqft.toLocaleString('en-IN')}/sq.ft avg
            </div>
          </div>
          <button id="predict-btn-${loc.name.replace(/\s+/g, '-')}" style="
            width: 100%;
            background-color: #059669;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            Predict for ${loc.name}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`predict-btn-${loc.name.replace(/\s+/g, '-')}`);
        if (btn) {
          btn.onclick = () => onPredictForLocality(loc.name);
        }
        onSelectLocality(loc);
      });

      markersRef.current[loc.name] = marker;
    });

  }, [localities, onSelectLocality, onPredictForLocality]);

  // Pan to selected locality when changed
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocalityName) {
      const loc = localities.find(l => l.name === selectedLocalityName);
      if (loc) {
        mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 13, { duration: 1.2 });
        const marker = markersRef.current[loc.name];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [selectedLocalityName, localities]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Map Header & Filter Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Interactive Bengaluru Geographic Explorer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Locality centroid markers verified against OpenStreetMap coordinates. Click markers to inspect dataset medians.
          </p>
        </div>

        {/* Zone Filter & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map + Synchronized Locality List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 h-[520px]">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-2 relative h-[300px] lg:h-full bg-slate-100 dark:bg-slate-800">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-[11px] shadow-sm space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Median Dataset Price</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">High Tier (&gt; ₹1.20 Cr)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Mid Tier (₹70L – ₹1.20 Cr)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Accessible (&lt; ₹70 Lakh)</span>
            </div>
          </div>
        </div>

        {/* Synchronized Locality List */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 overflow-y-auto p-3 space-y-2 h-[220px] lg:h-full bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
            {filteredLocalities.length} Localities in View
          </div>

          {filteredLocalities.map((loc) => {
            const isSelected = selectedLocalityName === loc.name;
            return (
              <div
                key={loc.name}
                onClick={() => {
                  onSelectLocality(loc);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 13);
                    const marker = markersRef.current[loc.name];
                    if (marker) marker.openPopup();
                  }
                }}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-emerald-600 dark:border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {loc.name}
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatIndianCurrency(loc.medianPriceLakhs)}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{loc.zone}</span>
                  <span>₹{loc.avgPricePerSqft.toLocaleString('en-IN')}/sq.ft</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {loc.count} sample records
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPredictForLocality(loc.name);
                    }}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    Predict Price <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
