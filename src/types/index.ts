export interface PropertyRecord {
  id: string;
  location: string;
  area_type: 'Super built-up Area' | 'Built-up Area' | 'Plot Area' | 'Carpet Area';
  total_sqft: number;
  bhk: number;
  bath: number;
  balcony: number;
  price: number; // in Lakhs (INR)
  price_per_sqft: number; // price * 100000 / total_sqft
  availability: string;
  society?: string;
  latitude: number;
  longitude: number;
  image?: string;
  property_type: 'Apartment' | 'Independent House' | 'Villa' | 'Plot';
}

export interface LocalityInfo {
  name: string;
  latitude: number;
  longitude: number;
  count: number;
  avgPriceLakhs: number;
  medianPriceLakhs: number;
  avgPricePerSqft: number;
  popularBhk: number;
  zone: 'East Bengaluru' | 'South Bengaluru' | 'North Bengaluru' | 'West Bengaluru' | 'Central Bengaluru';
}

export interface PredictionInput {
  location: string;
  total_sqft: number;
  bhk: number;
  bath: number;
  balcony: number;
  area_type?: string;
  property_type?: string;
  furnishing?: string;
  model_type?: 'linear' | 'ridge' | 'random_forest';
}

export interface PredictionResult {
  id: string;
  timestamp: string;
  input: PredictionInput;
  predicted_price_lakhs: number;
  predicted_price_inr: number;
  price_formatted: string;
  price_per_sqft: number;
  confidence_interval: {
    min_lakhs: number;
    max_lakhs: number;
    min_formatted: string;
    max_formatted: string;
  };
  model_used: string;
  model_metrics: {
    mae: number;
    rmse: number;
    r2_score: number;
  };
  locality_median_price: number;
  locality_avg_sqft_price: number;
  comparables: PropertyRecord[];
  disclaimer: string;
}

export interface DatasetSummary {
  totalRecords: number;
  medianPriceLakhs: number;
  meanPriceLakhs: number;
  medianPricePerSqft: number;
  topLocality: string;
  totalLocalities: number;
  minPriceLakhs: number;
  maxPriceLakhs: number;
  cleaningAudit: {
    step: string;
    removedRows: number;
    remainingRows: number;
    reason: string;
  }[];
}

export interface ModelMetricComparison {
  name: string;
  type: string;
  mae: number;
  rmse: number;
  r2: number;
  description: string;
}
