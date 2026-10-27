/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PredictPage } from './pages/PredictPage';
import { ResultPage } from './pages/ResultPage';
import { ExplorePage } from './pages/ExplorePage';
import { MarketInsightsPage } from './pages/MarketInsightsPage';
import { AboutModelPage } from './pages/AboutModelPage';
import { HistoryPage } from './pages/HistoryPage';
import { LocalityInfo, PropertyRecord, DatasetSummary, ModelMetricComparison, PredictionResult } from './types';
import { ApiService } from './services/apiService';
import { BENGALURU_LOCALITIES, RAW_PROPERTY_RECORDS, DATASET_SUMMARY, MODEL_METRICS_COMPARISON } from './data/bengaluruDataset';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data states
  const [localities, setLocalities] = useState<LocalityInfo[]>(BENGALURU_LOCALITIES);
  const [properties, setProperties] = useState<PropertyRecord[]>(RAW_PROPERTY_RECORDS);
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary>(DATASET_SUMMARY);
  const [modelMetrics, setModelMetrics] = useState<ModelMetricComparison[]>(MODEL_METRICS_COMPARISON);
  const [history, setHistory] = useState<PredictionResult[]>([]);

  // Navigation & Prediction states
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [preselectedInput, setPreselectedInput] = useState<{
    locality?: string;
    sqft?: number;
    bhk?: number;
  }>({});

  // Initialize theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Load history and remote data if available
  useEffect(() => {
    setHistory(ApiService.getHistory());

    ApiService.getLocalities().then(setLocalities);
    ApiService.getProperties().then(setProperties);
    ApiService.getDatasetSummary().then(setDatasetSummary);
    ApiService.getModelMetrics().then(setModelMetrics);
  }, []);

  const refreshHistory = () => {
    setHistory(ApiService.getHistory());
  };

  // Handlers
  const handleQuickPredict = (locality: string, sqft: number, bhk: number) => {
    setPreselectedInput({ locality, sqft, bhk });
    setActiveTab('predict');
  };

  const handlePredictionComplete = (result: PredictionResult) => {
    setCurrentPrediction(result);
    refreshHistory();
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectComparable = (comp: PropertyRecord) => {
    setPreselectedInput({
      locality: comp.location,
      sqft: comp.total_sqft,
      bhk: comp.bhk
    });
    setActiveTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePredictForLocality = (localityName: string) => {
    setPreselectedInput({
      locality: localityName,
      sqft: 1450,
      bhk: 3
    });
    setActiveTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPropertyToPredict = (prop: PropertyRecord) => {
    setPreselectedInput({
      locality: prop.location,
      sqft: prop.total_sqft,
      bhk: prop.bhk
    });
    setActiveTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDark}
        toggleTheme={toggleTheme}
        historyCount={history.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'home' && (
          <HomePage
            localities={localities}
            datasetSummary={datasetSummary}
            onNavigate={(tab, params) => {
              if (params?.locality) {
                setPreselectedInput({ locality: params.locality });
              }
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickPredict={handleQuickPredict}
          />
        )}

        {activeTab === 'predict' && (
          <PredictPage
            localities={localities}
            onPredictionComplete={handlePredictionComplete}
            preselectedLocality={preselectedInput.locality}
            preselectedSqft={preselectedInput.sqft}
            preselectedBhk={preselectedInput.bhk}
          />
        )}

        {activeTab === 'result' && currentPrediction && (
          <ResultPage
            result={currentPrediction}
            onEditInputs={() => setActiveTab('predict')}
            onSelectComparable={handleSelectComparable}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorePage
            properties={properties}
            localities={localities}
            onPredictForLocality={handlePredictForLocality}
            onSelectPropertyToPredict={handleSelectPropertyToPredict}
          />
        )}

        {activeTab === 'insights' && (
          <MarketInsightsPage
            localities={localities}
            properties={properties}
            modelMetrics={modelMetrics}
            datasetSummary={datasetSummary}
          />
        )}

        {activeTab === 'about' && (
          <AboutModelPage
            datasetSummary={datasetSummary}
            modelMetrics={modelMetrics}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            history={history}
            onSelectPrediction={(pred) => {
              setCurrentPrediction(pred);
              setActiveTab('result');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRefreshHistory={refreshHistory}
            onNavigateToPredict={() => setActiveTab('predict')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
