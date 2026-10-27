import React from 'react';
import { Home } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand and Description */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                HomeWise <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Intelligent residential real estate valuation engine for Bengaluru, Karnataka. Built with scikit-learn regression pipelines trained on verified housing data.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('predict')} className="hover:text-white transition-colors">
                  Predict House Price
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-white transition-colors">
                  Bengaluru Properties & Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('insights')} className="hover:text-white transition-colors">
                  Market Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Machine Learning Architecture */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">ML Architecture</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  Model Evaluation & R² Metrics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  Preprocessing & Outlier Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  Linear vs Random Forest Benchmarks
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  Run FastAPI Backend Locally
                </button>
              </li>
            </ul>
          </div>

          {/* Dataset Attribution & Scope */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Dataset & Provenance</h4>
            <p className="text-slate-400 leading-relaxed mb-2">
              Primary source: Bengaluru House Price Data (13,320 original records, 11,862 cleaned records).
            </p>
            <span className="text-slate-500">
              License: Open Database / CC0 Public Domain. Coordinates verified via OpenStreetMap.
            </span>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom Row */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[11px] leading-relaxed max-w-3xl">
            <strong className="text-slate-400">Informational Disclaimer:</strong> HomeWise AI predictions are statistical approximations derived from historical property transactions and characteristics in Bengaluru. They do not constitute an official appraisal, financial advice, or a guaranteed transaction valuation. Actual market valuations depend on physical property condition, legal encumbrances, floor rise, builder reputation, and negotiating factors.
          </p>
          <div className="text-slate-500 text-[11px] whitespace-nowrap">
            © {new Date().getFullYear()} HomeWise AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
