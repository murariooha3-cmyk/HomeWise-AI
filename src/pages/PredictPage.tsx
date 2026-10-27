import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, AlertCircle, RefreshCw, CheckCircle2, ChevronRight, HelpCircle, Layers, Home } from 'lucide-react';
import { LocalityInfo, PredictionInput, PredictionResult } from '../types';
import { ApiService } from '../services/apiService';
import { formatIndianCurrency } from '../services/mlEngine';

interface PredictPageProps {
  localities: LocalityInfo[];
  onPredictionComplete: (result: PredictionResult) => void;
  preselectedLocality?: string;
  preselectedSqft?: number;
  preselectedBhk?: number;
}

export const PredictPage: React.FC<PredictPageProps> = ({
  localities,
  onPredictionComplete,
  preselectedLocality,
  preselectedSqft,
  preselectedBhk
}) => {
  const [location, setLocation] = useState(preselectedLocality || 'Whitefield');
  const [totalSqft, setTotalSqft] = useState<number | ''>(preselectedSqft || 1450);
  const [bhk, setBhk] = useState<number>(preselectedBhk || 3);
  const [bath, setBath] = useState<number>(3);
  const [balcony, setBalcony] = useState<number>(2);
  const [areaType, setAreaType] = useState('Super built-up Area');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [modelType, setModelType] = useState<'random_forest' | 'ridge' | 'linear'>('random_forest');

  const [localitySearch, setLocalitySearch] = useState(preselectedLocality || 'Whitefield');
  const [isLocalityDropdownOpen, setIsLocalityDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [backendEngineStatus, setBackendEngineStatus] = useState<string>('Checking engine...');

  useEffect(() => {
    ApiService.checkBackendHealth().then(h => {
      setBackendEngineStatus(h.engine);
    });
  }, []);

  const selectedLocalityInfo = localities.find(
    l => l.name.toLowerCase() === location.toLowerCase()
  ) || localities[0];

  const filteredLocalities = localities.filter(l =>
    l.name.toLowerCase().includes(localitySearch.toLowerCase())
  );

  // Validation
  const validate = (): string | null => {
    if (!location.trim()) {
      return 'Please choose a Bengaluru locality.';
    }
    if (typeof totalSqft !== 'number' || totalSqft <= 0) {
      return 'Total area must be a positive number greater than 0.';
    }
    if (totalSqft < 300) {
      return 'Total area is too small for a residential unit (minimum 300 sq.ft).';
    }
    if (totalSqft > 40000) {
      return 'Total area exceeds residential threshold (max 40,000 sq.ft).';
    }
    if (bhk < 1 || bhk > 10) {
      return 'Bedrooms (BHK) must be between 1 and 10.';
    }
    if (bath < 1 || bath > 12) {
      return 'Bathrooms must be between 1 and 12.';
    }
    // Bedroom density validation
    const sqftPerBed = totalSqft / bhk;
    if (sqftPerBed < 200) {
      return `Invalid ratio: ${totalSqft} sq.ft with ${bhk} BHK yields ${Math.round(sqftPerBed)} sq.ft per bedroom, which fails physical construction feasibility (min 200 sq.ft/room).`;
    }
    // Bathroom consistency check
    if (bath > bhk + 2) {
      return `Bathrooms (${bath}) cannot exceed bedrooms (${bhk}) by more than 2 in standard residential layouts.`;
    }
    return null;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setLoading(true);

    const inputPayload: PredictionInput = {
      location,
      total_sqft: Number(totalSqft),
      bhk,
      bath,
      balcony,
      area_type: areaType,
      property_type: propertyType,
      furnishing,
      model_type: modelType
    };

    try {
      const result = await ApiService.predict(inputPayload);
      onPredictionComplete(result);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to generate prediction. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLocation('Whitefield');
    setLocalitySearch('Whitefield');
    setTotalSqft(1450);
    setBhk(3);
    setBath(3);
    setBalcony(2);
    setAreaType('Super built-up Area');
    setPropertyType('Apartment');
    setFurnishing('Semi-Furnished');
    setModelType('random_forest');
    setValidationError(null);
  };

  const handleFillSample = (sampleType: 'apartment' | 'villa' | 'compact') => {
    if (sampleType === 'apartment') {
      setLocation('Sarjapur Road');
      setLocalitySearch('Sarjapur Road');
      setTotalSqft(1521);
      setBhk(3);
      setBath(3);
      setBalcony(2);
      setPropertyType('Apartment');
      setAreaType('Super built-up Area');
    } else if (sampleType === 'villa') {
      setLocation('Whitefield');
      setLocalitySearch('Whitefield');
      setTotalSqft(2600);
      setBhk(4);
      setBath(4);
      setBalcony(3);
      setPropertyType('Villa');
      setAreaType('Plot Area');
    } else {
      setLocation('Electronic City');
      setLocalitySearch('Electronic City');
      setTotalSqft(920);
      setBhk(2);
      setBath(2);
      setBalcony(1);
      setPropertyType('Apartment');
      setAreaType('Super built-up Area');
    }
    setValidationError(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Machine Learning Valuation Form</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bengaluru Residential Price Estimator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Provide specific property attributes to run the trained regression pipeline. All inputs are strictly validated against dataset limits.
        </p>
      </div>

      {/* Sample Quick-Fill Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Pre-populate from verified benchmark records:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFillSample('apartment')}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
          >
            3 BHK Sarjapur (1,521 sqft)
          </button>
          <button
            type="button"
            onClick={() => handleFillSample('villa')}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
          >
            4 BHK Whitefield Villa (2,600 sqft)
          </button>
          <button
            type="button"
            onClick={() => handleFillSample('compact')}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
          >
            2 BHK Electronic City (920 sqft)
          </button>
        </div>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Input Validation Issue: </span>
            {validationError}
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handlePredict} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Section 1: Locality Autocomplete with Context */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              01. Bengaluru Locality
            </label>
            <span className="text-[11px] text-slate-400">
              {localities.length} Verified Localities
            </span>
          </div>

          <div className="relative">
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-emerald-600" />
              <input
                type="text"
                value={localitySearch}
                onChange={(e) => {
                  setLocalitySearch(e.target.value);
                  setIsLocalityDropdownOpen(true);
                }}
                onFocus={() => setIsLocalityDropdownOpen(true)}
                placeholder="Search Bengaluru locality (e.g., Whitefield, Indiranagar)..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Locality Dropdown List */}
            {isLocalityDropdownOpen && (
              <div className="absolute z-40 mt-1 w-full max-h-56 overflow-y-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLocalities.length > 0 ? (
                  filteredLocalities.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => {
                        setLocation(loc.name);
                        setLocalitySearch(loc.name);
                        setIsLocalityDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {loc.name}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        Median: {formatIndianCurrency(loc.medianPriceLakhs)}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-500">
                    No matching locality found. Unseen localities will be modeled via statistical baseline encoding.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Locality Live Context Card */}
          {selectedLocalityInfo && (
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-900 dark:text-emerald-300">
                  {selectedLocalityInfo.name}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400">
                  · {selectedLocalityInfo.zone}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-emerald-800 dark:text-emerald-300 font-mono">
                <span>Median: {formatIndianCurrency(selectedLocalityInfo.medianPriceLakhs)}</span>
                <span>Avg: ₹{selectedLocalityInfo.avgPricePerSqft.toLocaleString('en-IN')}/sq.ft</span>
                <span>{selectedLocalityInfo.count} samples</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Property Specifications */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
            02. Core Property Specifications
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Total Area (Square Feet) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Range: 300 – 40,000</span>
              </div>
              <input
                type="number"
                min={300}
                max={40000}
                required
                value={totalSqft}
                onChange={(e) => setTotalSqft(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 1450"
                className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* BHK Count */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Bedrooms (BHK) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Selected: {bhk} BHK</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setBhk(num);
                      // Auto-adjust bath if needed
                      if (bath < num) setBath(num);
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      bhk === num
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {num} BHK
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bathrooms */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                Bathrooms <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBath(num)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      bath === num
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Balconies */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                Balconies
              </label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBalcony(num)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      balcony === num
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Architectural Category & Machine Learning Model Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
            03. Property Category & ML Model Selection
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Property Archetype
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Apartment">Residential Apartment</option>
                <option value="Villa">Gated Community Villa</option>
                <option value="Independent House">Independent House</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Area Measurement Standard
              </label>
              <select
                value={areaType}
                onChange={(e) => setAreaType(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Super built-up Area">Super built-up Area</option>
                <option value="Built-up Area">Built-up Area</option>
                <option value="Plot Area">Plot Area</option>
                <option value="Carpet Area">Carpet Area</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Machine Learning Estimator
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="random_forest">Random Forest (Recommended · R² 0.884)</option>
                <option value="ridge">Ridge Regression (L2 Regularized · R² 0.838)</option>
                <option value="linear">Linear Regression (OLS Baseline · R² 0.815)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submission Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Inference Engine: {backendEngineStatus}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Regression...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Predict House Price</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
