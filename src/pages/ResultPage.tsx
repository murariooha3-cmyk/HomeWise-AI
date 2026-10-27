import React from 'react';
import { PredictionResult } from '../types';
import { Sparkles, Download, ArrowLeft, ShieldAlert, BarChart3, Building, MapPin, CheckCircle, Share2, Layers } from 'lucide-react';
import { formatIndianCurrency, formatFullINR } from '../services/mlEngine';
import { ApiService } from '../services/apiService';

interface ResultPageProps {
  result: PredictionResult;
  onEditInputs: () => void;
  onSelectComparable: (comp: any) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  onEditInputs,
  onSelectComparable
}) => {
  const { input, confidence_interval, model_metrics, comparables } = result;

  const downloadCSVReport = () => {
    const rows = [
      ['HomeWise AI — Bengaluru Property Valuation Report'],
      ['Generated At', new Date(result.timestamp).toLocaleString()],
      ['Locality', input.location],
      ['Total Area (Sq.Ft)', input.total_sqft],
      ['BHK Count', input.bhk],
      ['Bathrooms', input.bath],
      ['Balconies', input.balcony],
      ['Property Category', input.property_type || 'Apartment'],
      ['Measurement Standard', input.area_type || 'Super built-up Area'],
      [''],
      ['Predicted Price (Lakhs)', result.predicted_price_lakhs],
      ['Estimated Price (INR)', result.predicted_price_inr],
      ['Price Per Sq.Ft (INR)', result.price_per_sqft],
      ['90% Confidence Interval Min', confidence_interval.min_lakhs],
      ['90% Confidence Interval Max', confidence_interval.max_lakhs],
      ['Model Used', result.model_used],
      ['Model Test R2', model_metrics.r2_score],
      ['Model Test MAE (Lakhs)', model_metrics.mae],
      ['Locality Median (Lakhs)', result.locality_median_price],
      [''],
      ['Disclaimer', result.disclaimer]
    ];

    const csvContent = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `homewise_valuation_${input.location.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  // Compare against locality median: percentage difference
  const diffFromMedian = Math.round(((result.predicted_price_lakhs - result.locality_median_price) / result.locality_median_price) * 100);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 print:py-0 print:space-y-4">
      {/* Top action row */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={onEditInputs}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Inputs & Predict Again</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCSVReport}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={printReport}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
          >
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Primary Valuation Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Machine Learning Valuation Estimate</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {result.price_formatted}
            </h1>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              {formatFullINR(result.predicted_price_lakhs)} · Calculated at ₹{result.price_per_sqft.toLocaleString('en-IN')}/sq.ft
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 min-w-[220px]">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Statistical 90% Range
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-1">
              {confidence_interval.min_formatted} – {confidence_interval.max_formatted}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Derived from test-set RMSE (±1.96 standard error)
            </div>
          </div>
        </div>

        {/* Property Specs Recap (Zero-Pill Clean Typography) */}
        <div className="py-6 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Locality</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {input.location}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Area</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">
              {input.total_sqft} sq.ft
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Configuration</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {input.bhk} BHK · {input.bath} Baths
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Archetype</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {input.property_type || 'Apartment'}
            </span>
          </div>
        </div>

        {/* Market Context Indicator */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] text-slate-500 block">Locality Median Price</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {formatIndianCurrency(result.locality_median_price)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {diffFromMedian >= 0 ? `+${diffFromMedian}% above locality median` : `${diffFromMedian}% below locality median`}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] text-slate-500 block">Locality Avg Rate / Sq.Ft</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              ₹{result.locality_avg_sqft_price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Based on historical data for {input.location}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] text-slate-500 block">Estimator Pipeline</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block truncate">
              {result.model_used}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              R² = {model_metrics.r2_score} · MAE = {model_metrics.mae}L
            </span>
          </div>
        </div>
      </div>

      {/* Comparable Dataset Records */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Comparable Properties from Bengaluru Dataset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historical records matching {input.location} and ~{input.total_sqft} sq.ft configurations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparables.map((comp) => (
            <div
              key={comp.id}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500 transition-colors cursor-pointer"
              onClick={() => onSelectComparable(comp)}
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {comp.location}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {comp.bhk} BHK · {comp.total_sqft} sq.ft
              </div>
              <div className="mt-2 text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatIndianCurrency(comp.price)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                ₹{comp.price_per_sqft.toLocaleString('en-IN')}/sq.ft
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations Notice & Methodology Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-300 text-xs space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice on Historical Valuations & Legal Scope</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
          {result.disclaimer} Historical housing dataset records capture baseline transaction parameters at the date of data recording. Real market pricing varies with property age, builder quality (e.g. Prestige, Sobha, Brigade), specific floor elevation, clubhouse amenities, metro proximity, and title clarity.
        </p>
      </div>
    </div>
  );
};
