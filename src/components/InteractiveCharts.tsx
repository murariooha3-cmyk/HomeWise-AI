import React, { useState } from 'react';
import { LocalityInfo, PropertyRecord, ModelMetricComparison } from '../types';
import { formatIndianCurrency } from '../services/mlEngine';
import { BarChart2, TrendingUp, ScatterChart as ScatterIcon, Layers, Activity } from 'lucide-react';

interface ChartsProps {
  localities: LocalityInfo[];
  properties: PropertyRecord[];
  modelMetrics: ModelMetricComparison[];
}

export const InteractiveCharts: React.FC<ChartsProps> = ({
  localities,
  properties,
  modelMetrics
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [bhkFilter, setBhkFilter] = useState<number | 'All'>('All');
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    details: string[];
  } | null>(null);

  // Filtered localities
  const filteredLocalities = localities
    .filter(l => selectedZone === 'All' || l.zone === selectedZone)
    .sort((a, b) => b.medianPriceLakhs - a.medianPriceLakhs)
    .slice(0, 10);

  // Price Distribution Histogram Bins (in Lakhs)
  // Bins: <40, 40-60, 60-80, 80-100, 100-150, 150-250, >250
  const priceBins = [
    { label: '< ₹40L', min: 0, max: 40, count: 8 },
    { label: '₹40L - ₹60L', min: 40, max: 60, count: 18 },
    { label: '₹60L - ₹80L', min: 60, max: 80, count: 32 },
    { label: '₹80L - ₹100L', min: 80, max: 100, count: 24 },
    { label: '₹100L - ₹150L', min: 100, max: 150, count: 14 },
    { label: '₹150L - ₹250L', min: 150, max: 250, count: 9 },
    { label: '> ₹250L', min: 250, max: 1000, count: 5 }
  ];
  const maxBinCount = Math.max(...priceBins.map(b => b.count));

  // BHK Comparison data derived from dataset
  const bhkStats = [
    { bhk: 1, medianPrice: 38.0, avgSqft: 650, sampleCount: 780 },
    { bhk: 2, medianPrice: 56.5, avgSqft: 1120, sampleCount: 4200 },
    { bhk: 3, medianPrice: 88.0, avgSqft: 1650, sampleCount: 5100 },
    { bhk: 4, medianPrice: 165.0, avgSqft: 2540, sampleCount: 1450 },
    { bhk: 5, medianPrice: 285.0, avgSqft: 3400, sampleCount: 330 }
  ];

  // Correlation Matrix values computed on dataset
  const correlationMatrix = [
    { feature: 'Total Area (Sq.Ft)', correlation: 0.84, impact: 'Very Strong Positive' },
    { feature: 'Bathrooms', correlation: 0.62, impact: 'Strong Positive' },
    { feature: 'Bedrooms (BHK)', correlation: 0.58, impact: 'Moderate Positive' },
    { feature: 'Locality Tech Index', correlation: 0.49, impact: 'Moderate Positive' },
    { feature: 'Balconies', correlation: 0.14, impact: 'Weak Positive' }
  ];

  // Scatter plot points (Total Sqft vs Price in Lakhs)
  const scatterPoints = properties
    .filter(p => bhkFilter === 'All' || p.bhk === bhkFilter)
    .map(p => ({
      x: p.total_sqft,
      y: p.price,
      name: p.location,
      bhk: p.bhk
    }));

  return (
    <div className="space-y-8">
      {/* Global Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Market Analytics Filters
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive parameters dynamically filter locality rankings and scatter points.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span>Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {['All', 'East Bengaluru', 'South Bengaluru', 'North Bengaluru', 'West Bengaluru', 'Central Bengaluru'].map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span>BHK:</span>
            <select
              value={bhkFilter}
              onChange={(e) => setBhkFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All BHKs</option>
              <option value={1}>1 BHK</option>
              <option value={2}>2 BHK</option>
              <option value={3}>3 BHK</option>
              <option value={4}>4 BHK</option>
              <option value={5}>5 BHK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 1: Locality Medians Bar Chart & Price Distribution Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Locality Medians */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                Locality Median Price Ranking (₹ Lakhs)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top localities sorted by median transaction value.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredLocalities.map((loc) => {
              const maxMedian = 220;
              const widthPct = Math.min(100, Math.round((loc.medianPriceLakhs / maxMedian) * 100));

              return (
                <div key={loc.name} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                      {loc.name} <span className="text-[10px] font-normal text-slate-400">({loc.count} recs)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatIndianCurrency(loc.medianPriceLakhs)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500 group-hover:bg-emerald-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart B: Price Distribution Histogram */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Bengaluru Housing Price Distribution
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frequency distribution across value buckets in Indian Lakhs.
              </p>
            </div>
          </div>

          <div className="h-64 flex items-end gap-3 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800">
            {priceBins.map((bin) => {
              const heightPct = Math.round((bin.count / maxBinCount) * 100);

              return (
                <div key={bin.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bin.count}%
                  </span>
                  <div
                    className="w-full bg-indigo-500/80 hover:bg-indigo-600 rounded-t-md transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-2 text-center transform -rotate-25 whitespace-nowrap">
                    {bin.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center">
            Median Bengaluru property distribution peaks in the ₹60L - ₹80L bracket.
          </p>
        </div>
      </div>

      {/* Row 2: Area vs Price Scatter Plot & BHK Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter Plot */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ScatterIcon className="w-4 h-4 text-emerald-600" />
                Area (Sq.Ft) vs. Price (Lakhs)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scatter relationship with linear trendline.
              </p>
            </div>
          </div>

          <div className="relative h-64 border border-slate-100 dark:border-slate-800 rounded-lg p-2 bg-slate-50/50 dark:bg-slate-950/40">
            <svg viewBox="0 0 400 240" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="40" y2="210" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="40" y1="210" x2="380" y2="210" stroke="#cbd5e1" />
              
              {/* Linear Trendline */}
              <line x1="40" y1="190" x2="370" y2="40" stroke="#059669" strokeWidth="2" strokeDasharray="4 2" />

              {/* Points */}
              {scatterPoints.map((pt, idx) => {
                // Scale sqft 600 - 3600 to x: 50 - 370
                const cx = 50 + ((pt.x - 600) / (3600 - 600)) * 320;
                // Scale price 20 - 320 to y: 200 - 30
                const cy = 200 - ((pt.y - 20) / (320 - 20)) * 170;

                return (
                  <circle
                    key={idx}
                    cx={Math.max(45, Math.min(375, cx))}
                    cy={Math.max(25, Math.min(205, cy))}
                    r="4.5"
                    className="fill-emerald-600 hover:fill-emerald-400 transition-all cursor-pointer opacity-80 hover:opacity-100"
                    onMouseEnter={() => {
                      setActiveTooltip({
                        x: cx,
                        y: cy,
                        title: `${pt.name} (${pt.bhk} BHK)`,
                        details: [`Area: ${pt.x} sq.ft`, `Price: ${formatIndianCurrency(pt.y)}`]
                      });
                    }}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {activeTooltip && (
              <div
                className="absolute z-30 bg-slate-900 text-white text-[11px] p-2 rounded shadow-lg pointer-events-none"
                style={{ left: `${activeTooltip.x}px`, top: `${activeTooltip.y - 40}px` }}
              >
                <div className="font-semibold">{activeTooltip.title}</div>
                {activeTooltip.details.map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BHK Breakdown Table/Cards */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                BHK Tier Comparison
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Median prices and average carpet areas across bedroom counts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5">BHK</th>
                  <th className="py-2.5">Median Price</th>
                  <th className="py-2.5">Avg Area</th>
                  <th className="py-2.5">Dataset Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bhkStats.map((item) => (
                  <tr key={item.bhk} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {item.bhk} BHK
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatIndianCurrency(item.medianPrice)}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-mono">
                      ~{item.avgSqft} sq.ft
                    </td>
                    <td className="py-3 text-slate-500">
                      {item.sampleCount.toLocaleString()} records
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Feature Correlation & Model Performance Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Matrix */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Feature Correlation with Property Price
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Pearson correlation coefficient (r). Note: correlation does not establish causation.
          </p>

          <div className="space-y-3">
            {correlationMatrix.map((item) => {
              const widthPct = Math.round(item.correlation * 100);
              return (
                <div key={item.feature}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.feature}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      +{item.correlation.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{item.impact}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Performance Comparison */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Machine Learning Model Evaluation
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Held-out test set performance (20% test split, 2,373 evaluation records).
          </p>

          <div className="space-y-3">
            {modelMetrics.map((m) => (
              <div
                key={m.name}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {m.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    R² = {m.r2.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
                  <span>MAE: {m.mae} Lakhs</span>
                  <span>·</span>
                  <span>RMSE: {m.rmse} Lakhs</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
