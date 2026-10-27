import { PredictionInput, PredictionResult, LocalityInfo, PropertyRecord, DatasetSummary, ModelMetricComparison } from '../types';
import { predictHousePrice } from './mlEngine';
import { BENGALURU_LOCALITIES, RAW_PROPERTY_RECORDS, DATASET_SUMMARY, MODEL_METRICS_COMPARISON } from '../data/bengaluruDataset';

const API_BASE = '/api';
const HISTORY_STORAGE_KEY = 'homewise_prediction_history';

export class ApiService {
  // Check backend health
  static async checkBackendHealth(): Promise<{ status: string; engine: string }> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        const data = await res.json();
        return { status: 'connected', engine: data.engine || 'FastAPI Scikit-Learn Engine' };
      }
    } catch {
      // expected when running pure frontend or dev sandbox
    }
    return { status: 'embedded', engine: 'Local Scikit-Learn Runtime Pipeline' };
  }

  // Predict house price
  static async predict(input: PredictionInput): Promise<PredictionResult> {
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const result: PredictionResult = await res.json();
        this.saveToHistory(result);
        return result;
      }
    } catch {
      // Fallback to embedded ML inference pipeline
    }

    // Embed ML inference execution
    const result = predictHousePrice(input);
    this.saveToHistory(result);
    return result;
  }

  // Fetch localities
  static async getLocalities(): Promise<LocalityInfo[]> {
    try {
      const res = await fetch(`${API_BASE}/localities`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return BENGALURU_LOCALITIES;
  }

  // Fetch properties
  static async getProperties(): Promise<PropertyRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/properties`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return RAW_PROPERTY_RECORDS;
  }

  // Fetch dataset summary
  static async getDatasetSummary(): Promise<DatasetSummary> {
    try {
      const res = await fetch(`${API_BASE}/dataset/info`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return DATASET_SUMMARY;
  }

  // Fetch model metrics comparison
  static async getModelMetrics(): Promise<ModelMetricComparison[]> {
    try {
      const res = await fetch(`${API_BASE}/model/metrics`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return MODEL_METRICS_COMPARISON;
  }

  // Prediction History Management
  static getHistory(): PredictionResult[] {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to read history from localStorage', e);
    }
    return [];
  }

  static saveToHistory(result: PredictionResult): void {
    try {
      const existing = this.getHistory();
      const updated = [result, ...existing.filter(item => item.id !== result.id)].slice(0, 30);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to write history', e);
    }
  }

  static deleteHistoryItem(id: string): void {
    try {
      const existing = this.getHistory();
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to delete history item', e);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear history', e);
    }
  }

  static exportHistoryToCSV(): void {
    const history = this.getHistory();
    if (history.length === 0) return;

    const headers = ['Timestamp', 'Locality', 'Total Sqft', 'BHK', 'Bathrooms', 'Balconies', 'Predicted Price (Lakhs)', 'Price Per Sqft (INR)', 'Model'];
    const rows = history.map(h => [
      `"${new Date(h.timestamp).toLocaleString()}"`,
      `"${h.input.location}"`,
      h.input.total_sqft,
      h.input.bhk,
      h.input.bath,
      h.input.balcony,
      h.predicted_price_lakhs,
      h.price_per_sqft,
      `"${h.model_used}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `homewise_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
