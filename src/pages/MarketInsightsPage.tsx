import React from 'react';
import { LocalityInfo, PropertyRecord, ModelMetricComparison, DatasetSummary } from '../types';
import { InteractiveCharts } from '../components/InteractiveCharts';
import { BarChart3, TrendingUp, Download, Info } from 'lucide-react';
import { formatIndianCurrency } from '../services/mlEngine';

interface InsightsProps {
  localities: LocalityInfo[];
  properties: PropertyRecord[];
  modelMetrics: ModelMetricComparison[];
  datasetSummary: DatasetSummary;
}

export const MarketInsightsPage: React.FC<InsightsProps> = ({
  localities,
  properties,
  modelMetrics,
  datasetSummary
}) => {
  const exportMarketSummary = () => {
    const headers = ['Locality', 'Zone', 'Sample Count', 'Median Price (Lakhs)', 'Avg Price Per Sq.Ft (INR)', 'Popular BHK'];
    const rows = localities.map(l => [
      `"${l.name}"`,
      `"${l.zone}"`,
      l.count,
      l.medianPriceLakhs,
      l.avgPricePerSqft,
      `${l.popularBhk} BHK`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bengaluru_market_insights_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bengaluru Housing Market Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Market Insights & Price Dynamics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Quantitative analysis derived from verified residential transaction records across Bengaluru's tech and suburban corridors.
          </p>
        </div>

        <button
          onClick={exportMarketSummary}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400">Total Valid Observations</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {datasetSummary.totalRecords.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Post outlier filtration</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400">Overall Median Price</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatIndianCurrency(datasetSummary.medianPriceLakhs)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Mean: {formatIndianCurrency(datasetSummary.meanPriceLakhs)}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400">Median Rate / Sq.Ft</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{datasetSummary.medianPricePerSqft.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Citywide base metric</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400">Correlation (Area ↔ Price)</div>
          <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            r = +0.84
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Primary pricing driver</div>
        </div>
      </div>

      {/* Interactive Charts Component */}
      <InteractiveCharts
        localities={localities}
        properties={properties}
        modelMetrics={modelMetrics}
      />
    </div>
  );
};
