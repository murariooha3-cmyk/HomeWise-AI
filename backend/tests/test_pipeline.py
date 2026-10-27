"""
Comprehensive Test Suite for HomeWise AI Pipeline
Tests preprocessing, feature validation, prediction limits, unknown localities, and analytics.
"""

import pytest
import numpy as np
import pandas as pd
from preprocess import clean_total_sqft, clean_bhk, run_preprocessing_pipeline
from schemas import PredictionRequest
from predict import ModelInferenceService
from analytics import get_dataset_analytics

def test_clean_total_sqft_range():
    assert clean_total_sqft("1200 - 1400") == 1300.0
    assert clean_total_sqft("2100-2850") == 2475.0
    assert clean_total_sqft("1500") == 1500.0
    assert np.isnan(clean_total_sqft("34.46Sq. Meter"))

def test_clean_bhk_parsing():
    assert clean_bhk("2 BHK") == 2.0
    assert clean_bhk("4 Bedroom") == 4.0
    assert clean_bhk("1 RK") == 1.0
    assert np.isnan(clean_bhk(""))

def test_preprocessing_pipeline_outliers():
    mock_data = pd.DataFrame([
        {'location': 'Whitefield', 'total_sqft': '1200', 'size': '2 BHK', 'bath': 2, 'balcony': 1, 'price': 65.0},
        {'location': 'Indiranagar', 'total_sqft': '500', 'size': '6 BHK', 'bath': 6, 'balcony': 1, 'price': 90.0}, # Outlier < 300 sqft/bhk
        {'location': 'Electronic City', 'total_sqft': '1000', 'size': '2 BHK', 'bath': 6, 'balcony': 1, 'price': 40.0}, # Outlier bath > bhk + 2
    ])
    cleaned_df, audit = run_preprocessing_pipeline(mock_data)
    assert len(cleaned_df) == 1
    assert cleaned_df.iloc[0]['location'] in ['Whitefield', 'Other']

def test_pydantic_schema_validation():
    # Valid input
    valid_req = PredictionRequest(
        location="Whitefield",
        total_sqft=1450.0,
        bhk=3,
        bath=3,
        balcony=2
    )
    assert valid_req.bhk == 3

    # Invalid area too small for 3 BHK (<200 sqft/bedroom)
    with pytest.raises(ValueError):
        PredictionRequest(
            location="Whitefield",
            total_sqft=300.0,
            bhk=3,
            bath=2,
            balcony=1
        )

    # Invalid bath > bhk + 2
    with pytest.raises(ValueError):
        PredictionRequest(
            location="Whitefield",
            total_sqft=1500.0,
            bhk=2,
            bath=5,
            balcony=1
        )

def test_inference_service_unknown_locality():
    service = ModelInferenceService()
    res = service.predict(location="UnknownNonExistentSuburb", total_sqft=1200, bhk=2, bath=2, balcony=1)
    assert res["predicted_price_lakhs"] > 0
    assert "confidence_interval" in res
    assert res["confidence_interval"]["min_lakhs"] < res["predicted_price_lakhs"] < res["confidence_interval"]["max_lakhs"]

def test_analytics_metrics_keys():
    analytics = get_dataset_analytics()
    assert "total_records" in analytics
    assert "median_price" in analytics
    assert "correlations" in analytics
    assert "total_sqft" in analytics["correlations"]
