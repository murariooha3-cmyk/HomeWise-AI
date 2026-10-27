import React, { useState } from 'react';
import { PredictionResult } from '../types';
import { History, Download, Trash2, ArrowUpRight, Sparkles, Building, Calendar, AlertTriangle } from 'lucide-react';
import { formatIndianCurrency } from '../services/mlEngine';
import { ApiService } from '../services/apiService';

interface HistoryProps {
  history: PredictionResult[];
  onSelectPrediction: (pred: PredictionResult) => void;
  onRefreshHistory: () => void;
  onNavigateToPredict: () => void;
}

export const HistoryPage: React.FC<HistoryProps> = ({
  history,
  onSelectPrediction,
  onRefreshHistory,
  onNavigateToPredict
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDelete = (id: string) => {
    ApiService.deleteHistoryItem(id);
    onRefreshHistory();
  };

  const executeClearAll = () => {
    ApiService.clearHistory();
    setShowClearConfirm(false);
    onRefreshHistory();
  };

  const handleExportCSV = () => {
    ApiService.exportHistoryToCSV();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Local Prediction Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Valuation History ({history.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Session history of generated predictions. Reopen any record, export to CSV, or clear logs.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            {!showClearConfirm ? (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  Clear All
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 px-3 py-1 rounded-lg">
                <span className="text-xs text-red-700 dark:text-red-300 font-medium">Clear all records?</span>
                <button
                  onClick={executeClearAll}
                  className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Saved Predictions Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Valuations you generate on the Predict Price page will automatically appear here with full specifications and metrics.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToPredict}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Predict Your First Property</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.input.location}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {item.input.bhk} BHK · {item.input.total_sqft} sq.ft
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>·</span>
                  <span>{item.model_used}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.price_formatted}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    ₹{item.price_per_sqft.toLocaleString('en-IN')}/sq.ft
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectPrediction(item)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View Full Report"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
