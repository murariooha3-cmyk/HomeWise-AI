from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any

class PredictionRequest(BaseModel):
    location: str = Field(..., min_length=2, max_length=100, description="Bengaluru locality name")
    total_sqft: float = Field(..., gt=100, lt=50000, description="Total area in square feet")
    bhk: int = Field(..., ge=1, le=10, description="Number of bedrooms (BHK)")
    bath: int = Field(..., ge=1, le=12, description="Number of bathrooms")
    balcony: int = Field(0, ge=0, le=6, description="Number of balconies")
    area_type: Optional[str] = Field("Super built-up Area", description="Type of area measurement")
    property_type: Optional[str] = Field("Apartment", description="Property architectural category")
    model_type: Optional[str] = Field("random_forest", description="ML Model: linear, ridge, or random_forest")

    @field_validator('bath')
    def validate_bath_vs_bhk(cls, v, info):
        if 'bhk' in info.data and v > info.data['bhk'] + 2:
            raise ValueError(f"Bathrooms ({v}) cannot unrealistically exceed bedrooms ({info.data['bhk']}) by more than 2.")
        return v

    @field_validator('total_sqft')
    def validate_sqft_per_bhk(cls, v, info):
        if 'bhk' in info.data and (v / info.data['bhk']) < 200:
            raise ValueError(f"Total area ({v} sqft) is unrealistically small for {info.data['bhk']} BHK (<200 sqft/bedroom).")
        return v

class ConfidenceInterval(BaseModel):
    min_lakhs: float
    max_lakhs: float
    min_formatted: str
    max_formatted: str

class ModelMetrics(BaseModel):
    mae: float
    rmse: float
    r2_score: float

class PredictionResponse(BaseModel):
    id: str
    timestamp: str
    input: Dict[str, Any]
    predicted_price_lakhs: float
    predicted_price_inr: int
    price_formatted: str
    price_per_sqft: int
    confidence_interval: ConfidenceInterval
    model_used: str
    model_metrics: ModelMetrics
    locality_median_price: float
    locality_avg_sqft_price: float
    disclaimer: str

class LocalitySummary(BaseModel):
    name: str
    latitude: float
    longitude: float
    count: int
    avgPriceLakhs: float
    medianPriceLakhs: float
    avgPricePerSqft: float
    popularBhk: int
    zone: str
