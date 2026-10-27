import React, { useState } from 'react';
import { Sparkles, MapPin, ArrowRight, ShieldCheck, Database, Cpu, Compass, ChevronRight } from 'lucide-react';
import { LocalityInfo, DatasetSummary } from '../types';
import { formatIndianCurrency } from '../services/mlEngine';
import { HERO_IMAGE } from '../data/bengaluruDataset';

interface HomePageProps {
  localities: LocalityInfo[];
  datasetSummary: DatasetSummary;
  onNavigate: (tab: string, params?: any) => void;
  onQuickPredict: (locality: string, sqft: number, bhk: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  localities,
  datasetSummary,
  onNavigate,
  onQuickPredict
}) => {
  const [quickLocality, setQuickLocality] = useState('Whitefield');
  const [quickSqft, setQuickSqft] = useState(1450);
  const [quickBhk, setQuickBhk] = useState(3);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickPredict(quickLocality, quickSqft, quickBhk);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[540px]">
          {/* Left Column: Proposition & Quick Predictor */}
          <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Bengaluru Machine Learning Property Valuation</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Find Your Home’s True Market Value.
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Trained on over 11,800 verified Bengaluru residential listings. Evaluate apartment, villa, and townhouse prices across 78 prime localities using scikit-learn regression pipelines.
              </p>
            </div>

            {/* Quick Prediction Widget */}
            <form
              onSubmit={handleQuickSubmit}
              className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Quick Valuation Estimator
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    Locality
                  </label>
                  <select
                    value={quickLocality}
                    onChange={(e) => setQuickLocality(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    {localities.slice(0, 10).map((l) => (
                      <option key={l.name} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    Area (Sq.Ft)
                  </label>
                  <input
                    type="number"
                    min={400}
                    max={10000}
                    value={quickSqft}
                    onChange={(e) => setQuickSqft(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    Bedrooms
                  </label>
                  <select
                    value={quickBhk}
                    onChange={(e) => setQuickBhk(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Estimate Price</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('predict')}
                  className="py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Detailed Form →
                </button>
              </div>
            </form>

            {/* Quick trust metrics */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <strong className="text-slate-800 dark:text-slate-200 font-mono">11,862</strong> Cleaned Records
              </div>
              <div>·</div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200 font-mono">R² = 0.884</strong> Random Forest
              </div>
              <div>·</div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">78</strong> Localities
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Fidelity Bengaluru Residence Photography */}
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full">
            <img
              src={HERO_IMAGE}
              alt="Contemporary premium residential apartment in Bengaluru"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md text-white p-3.5 rounded-xl border border-white/10 hidden sm:block">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">Bengaluru Residential Index</div>
                  <div className="text-[11px] text-slate-300">Whitefield, Indiranagar, Electronic City & Outer Ring Road</div>
                </div>
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-medium transition-colors"
                >
                  Explore Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Market Overview Stats Row */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
          DATASET BENCHMARK METRICS (DERIVED FROM VERIFIED HOUSING DATA)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Valid Records</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {datasetSummary.totalRecords.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Bengaluru Housing Dataset</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400">Median Listed Price</div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {formatIndianCurrency(datasetSummary.medianPriceLakhs)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all BHK categories</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400">Median Price / Sq.Ft</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              ₹{datasetSummary.medianPricePerSqft.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Super built-up base rate</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400">Most Represented Locality</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {datasetSummary.topLocality}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">540 residential listings</div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Bento-Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineered Real Estate Intelligence
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Combining rigorous statistical preprocessing, regularized linear modeling, and ensemble decision trees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                01. Multi-Model Prediction Pipeline
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Compare baseline Ordinary Least Squares (OLS), L2-regularized Ridge Regression, and 100-tree Random Forest Regressor models side by side.
              </p>
            </div>
            <button
              onClick={() => onNavigate('predict')}
              className="mt-6 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Start Prediction <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                02. Spatial Locality Insights
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive OpenStreetMap integration mapping verified Bengaluru tech corridor coordinates from Whitefield to Electronic City.
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="mt-6 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Explore Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                03. Transparent Data Audit
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Step-by-step row removal logs, bathroom consistency checks, bedroom density thresholds, and unadulterated regression metrics.
              </p>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="mt-6 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Read Methodology <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12">
        <div className="max-w-2xl mb-8">
          <div className="text-xs font-semibold text-emerald-400 mb-2">WORKFLOW METHODOLOGY</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How HomeWise AI Estimates Fair Property Value
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-emerald-400 font-mono text-sm font-bold mb-2">Step 01</div>
            <div className="font-bold text-sm mb-1">Enter Property Specs</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Input total area in square feet, BHK count, bathrooms, balconies, and property archetype.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-emerald-400 font-mono text-sm font-bold mb-2">Step 02</div>
            <div className="font-bold text-sm mb-1">Select Bengaluru Locality</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Choose from 78 verified localities with historical density, price-per-sqft, and spatial coordinates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-emerald-400 font-mono text-sm font-bold mb-2">Step 03</div>
            <div className="font-bold text-sm mb-1">ML Pipeline Inference</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Scikit-learn pipeline applies one-hot locality encodings, numerical scalers, and ensemble weighting.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-emerald-400 font-mono text-sm font-bold mb-2">Step 04</div>
            <div className="font-bold text-sm mb-1">Inspect Valuation Report</div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Review price in ₹ Lakhs/Crores, confidence range, comparables, and export predictions to PDF or CSV.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center sm:text-left">
          <button
            onClick={() => onNavigate('predict')}
            className="py-3 px-6 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Predict House Price Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Locality Spotlights Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Key Bengaluru Property Corridors
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Median benchmark prices calculated from verified historical records.
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View All 78 Localities →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {localities.slice(0, 6).map((loc) => (
            <div
              key={loc.name}
              onClick={() => onNavigate('predict', { locality: loc.name })}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition-all shadow-sm group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 truncate">
                {loc.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{loc.zone}</div>
              <div className="mt-2 text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatIndianCurrency(loc.medianPriceLakhs)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ₹{loc.avgPricePerSqft.toLocaleString('en-IN')}/sq.ft
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
