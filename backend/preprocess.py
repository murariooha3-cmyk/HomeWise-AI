"""
Bengaluru House Price Data Preprocessing Pipeline
Cleans raw property dataset, handles malformed total_sqft values, standardizes BHK,
removes extreme domain outliers, and groups rare localities.
"""

import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any, List

def clean_total_sqft(val: Any) -> float:
    """Converts ranges like '2100 - 2850' to float average; parses single values or returns NaN."""
    if pd.isna(val):
        return np.nan
    val_str = str(val).strip()
    if '-' in val_str:
        tokens = val_str.split('-')
        if len(tokens) == 2:
            try:
                return (float(tokens[0].strip()) + float(tokens[1].strip())) / 2.0
            except ValueError:
                return np.nan
    try:
        return float(val_str)
    except ValueError:
        return np.nan

def clean_bhk(val: Any) -> float:
    """Extracts integer bedroom count from strings like '2 BHK' or '4 Bedroom'."""
    if pd.isna(val):
        return np.nan
    val_str = str(val).strip()
    tokens = val_str.split(' ')
    try:
        return float(tokens[0])
    except (ValueError, IndexError):
        return np.nan

def run_preprocessing_pipeline(df_raw: pd.DataFrame) -> Tuple[pd.DataFrame, List[Dict[str, Any]]]:
    """
    Executes sequential data cleaning steps and produces a transparent audit log.
    """
    audit_log = []
    initial_rows = len(df_raw)
    audit_log.append({
        "step": "Raw Ingestion",
        "removedRows": 0,
        "remainingRows": initial_rows,
        "reason": "Initial raw dataset ingestion"
    })

    # Step 1: Drop missing critical values
    df = df_raw.dropna(subset=['location', 'price', 'total_sqft']).copy()
    step1_rows = len(df)
    audit_log.append({
        "step": "Drop Missing Critical Values",
        "removedRows": initial_rows - step1_rows,
        "remainingRows": step1_rows,
        "reason": "Dropped records with missing location, price, or total_sqft"
    })

    # Step 2: Extract numeric BHK from size
    if 'size' in df.columns:
        df['bhk'] = df['size'].apply(clean_bhk)
    elif 'bhk' not in df.columns:
        df['bhk'] = 2.0 # default
    df = df.dropna(subset=['bhk']).copy()
    df['bhk'] = df['bhk'].astype(int)
    step2_rows = len(df)
    audit_log.append({
        "step": "Parse BHK Feature",
        "removedRows": step1_rows - step2_rows,
        "remainingRows": step2_rows,
        "reason": "Extracted integer bedrooms from string descriptions"
    })

    # Step 3: Clean total_sqft
    df['total_sqft'] = df['total_sqft'].apply(clean_total_sqft)
    df = df.dropna(subset=['total_sqft']).copy()
    step3_rows = len(df)
    audit_log.append({
        "step": "Malformed Area Resolution",
        "removedRows": step2_rows - step3_rows,
        "remainingRows": step3_rows,
        "reason": "Resolved area ranges to midpoints and removed non-metric units"
    })

    # Step 4: Handle bath and balcony missing values
    df['bath'] = df['bath'].fillna(df['bhk'])
    if 'balcony' in df.columns:
        df['balcony'] = df['balcony'].fillna(1.0)
    else:
        df['balcony'] = 1.0

    # Step 5: Domain Outlier Filtering (sqft per bedroom < 300)
    df = df[~(df['total_sqft'] / df['bhk'] < 300)].copy()
    step5_rows = len(df)
    audit_log.append({
        "step": "Bedroom Density Outlier Removal",
        "removedRows": step3_rows - step5_rows,
        "remainingRows": step5_rows,
        "reason": "Removed unrealistic listings with < 300 sq.ft per bedroom"
    })

    # Step 6: Bathroom anomaly filtering (bath > bhk + 2)
    df = df[df['bath'] <= df['bhk'] + 2].copy()
    step6_rows = len(df)
    audit_log.append({
        "step": "Bathroom Consistency Filter",
        "removedRows": step5_rows - step6_rows,
        "remainingRows": step6_rows,
        "reason": "Removed entries where bathrooms exceed bedrooms by more than 2"
    })

    # Step 7: Locality normalization and rare category grouping
    df['location'] = df['location'].apply(lambda x: str(x).strip())
    location_stats = df.groupby('location')['location'].agg('count')
    location_stats_less_than_10 = location_stats[location_stats <= 10]
    df['location'] = df['location'].apply(lambda x: 'Other' if x in location_stats_less_than_10 else x)

    # Derived feature: price per sqft
    df['price_per_sqft'] = (df['price'] * 100000) / df['total_sqft']

    audit_log.append({
        "step": "Locality Grouping (count <= 10 -> Other)",
        "removedRows": 0,
        "remainingRows": len(df),
        "reason": "Grouped sparse localities to avoid overparameterization in one-hot encoding"
    })

    return df, audit_log
