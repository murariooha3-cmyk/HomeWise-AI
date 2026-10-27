# HomeWise AI — Intelligent Bengaluru House Price Prediction Platform

HomeWise AI is a full-stack real estate valuation and analytics web application engineered for residential properties in **Bengaluru, Karnataka, India**. It combines rigorous machine learning regression pipelines (Ordinary Least Squares, L2-Regularized Ridge Regression, and Random Forest Ensemble Regressor) trained on real Bengaluru housing transaction data with interactive geographic spatial exploration on Leaflet/OpenStreetMap, dynamic market analytics, 2D schematic floor plan layouts, and exportable valuation reports.

---

## 1. Project Overview

Predicting property values in Bengaluru requires modeling high-dimensional spatial variance across tech corridors (Whitefield, Electronic City, Outer Ring Road, Sarjapur Road) versus central luxury hubs (Indiranagar, Koramangala). HomeWise AI replaces arbitrary heuristics with an end-to-end scikit-learn machine learning pipeline that handles malformed square footage ranges, standardizes bedroom counts, filters anomalous bathroom-to-bedroom densities, and predicts fair market values with statistically defensible 90% confidence intervals.

---

## 2. Key Features

- **Multi-Model Machine Learning:** Train and benchmark **Linear Regression (OLS Baseline)**, **Ridge Regression (L2 Regularized)**, and **Random Forest Regressor (100 Trees)**.
- **Strict Input Validation:** Enforces structural feasibility rules (rejects zero/negative area, bathroom-to-bedroom ratio anomalies where $bath > bhk + 2$, and density $< 200$ sq.ft/room).
- **Statistically Defensible Confidence Interval:** Computes a 90% uncertainty range based on held-out test RMSE and locality sample density.
- **Interactive OpenStreetMap Map:** Leaflet map with verified centroid coordinates for 78 Bengaluru localities, price tier markers, and synchronized list filtering.
- **Interactive 2D Schematic Floor Plans:** Dynamic room layout viewer illustrating master bedrooms, living halls, modular kitchens, balconies, and proportional carpet areas across 1 to 5 BHK units.
- **Market Insights Dashboard:** Interactive SVG visualizations for price distribution histograms, locality median rankings, area-versus-price scatter plots with trendlines, BHK distributions, and feature correlation heatmaps.
- **Prediction History Archive:** Local prediction history tracking with reload into predictor, individual deletion, and CSV export.
- **Downloadable Reports:** Instant CSV export and formatted print-ready property valuation summary sheets.
- **Accessible & Responsive UI:** Dual light/dark themes, WCAG AA contrast compliance, zero-pill typography, and single-line control discipline.

---

## 3. Technology Stack

### Frontend:
- **Framework:** React 19 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4 (with Plus Jakarta Sans & Outfit typography)
- **Icons:** Lucide React
- **Geographic Maps:** Leaflet 1.9.4 with OpenStreetMap tile layer
- **Visuals:** Responsive SVG data visualization engine

### Backend:
- **API Framework:** Python 3.10+ with FastAPI
- **Data Engineering:** Pandas & NumPy
- **Machine Learning:** Scikit-Learn (Pipelines, ColumnTransformer, OneHotEncoder)
- **Serialization:** Joblib
- **Validation:** Pydantic v2
- **Database:** SQLite for prediction history persistence
- **Testing:** Pytest

---

## 4. Dataset Source, Provenance & Licensing

- **Dataset:** Bengaluru House Price Data (Kaggle / Open Data)
- **Raw Records:** 13,320 observations
- **Cleaned Records:** 11,862 observations
- **Licensing:** CC0 Public Domain / Open Database License
- **Target Variable:** `price` in Indian Lakhs (1 Lakh = ₹100,000 INR; 100 Lakhs = 1 Crore)
- **Features Cleaned:** `location`, `total_sqft`, `bhk`, `bath`, `balcony`, `area_type`

---

## 5. Directory Structure

```
homewise-ai/
├── backend/
│   ├── main.py                  # FastAPI server with CORS & endpoints
│   ├── schemas.py               # Pydantic request & response models
│   ├── preprocess.py            # Data cleaning & outlier removal pipeline
│   ├── train_model.py           # ML training script comparing OLS, Ridge & RF
│   ├── predict.py               # Inference service loading joblib pipeline
│   ├── analytics.py             # Data distributions & statistical calculations
│   ├── database.py              # SQLite prediction history storage
│   ├── requirements.txt         # Python dependencies
│   ├── data/                    # Raw & cleaned datasets, locality coordinates
│   ├── models/                  # Saved .joblib model pipelines & metrics JSON
│   └── tests/
│       └── test_pipeline.py     # Comprehensive automated test suite
├── src/
│   ├── assets/images/           # High-resolution architectural photography
│   ├── components/              # Navbar, Footer, InteractiveMap, FloorPlanViewer, Charts
│   ├── data/                    # Authentic Bengaluru dataset & locality coordinates
│   ├── pages/                   # Home, Predict, Result, Explore, Insights, About, History
│   ├── services/                # API service & client-side ML engine
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # Root application router
│   ├── index.css                # Global Tailwind CSS
│   └── main.tsx                 # React entrypoint
├── index.html                   # HTML shell with Google Fonts & Leaflet
├── package.json                 # Node dependencies
└── README.md                    # Project documentation
```

---

## 6. How to Run the Project Locally

### A. Backend Setup (FastAPI & Scikit-Learn)

#### Windows PowerShell:
```powershell
# 1. Navigate to the backend directory
cd backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# 4. Install backend dependencies
pip install -r requirements.txt

# 5. Execute the data preparation and ML training pipeline
python train_model.py

# 6. Run the automated test suite
pytest tests/test_pipeline.py -v

# 7. Start the FastAPI development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### macOS / Linux Bash:
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create Python virtual environment
python3 -m venv venv

# 3. Activate the virtual environment
source venv/bin/activate

# 4. Install backend dependencies
pip install -r requirements.txt

# 5. Execute data preparation & ML model training
python3 train_model.py

# 6. Run automated test suite
pytest tests/test_pipeline.py -v

# 7. Start FastAPI development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`  
Interactive Swagger docs: `http://localhost:8000/docs`

---

### B. Frontend Setup (React & Vite)

In a separate terminal window:
```bash
# 1. Install Node.js dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

The web application will open on `http://localhost:3000`.

---

## 7. API Endpoints Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check & model status |
| `GET` | `/api/localities` | List of 78 Bengaluru localities with coordinates & medians |
| `GET` | `/api/properties` | Verified residential sample listings |
| `GET` | `/api/dataset/info` | Dataset summary and row cleaning audit log |
| `GET` | `/api/analytics` | Statistical distributions, BHK counts & correlations |
| `GET` | `/api/model/metrics` | Model comparison table (MAE, RMSE, R²) |
| `POST` | `/api/predict` | Run ML valuation inference with confidence interval |
| `GET` | `/api/history` | Retrieve saved prediction records from SQLite |
| `DELETE`| `/api/history/{id}` | Delete a prediction record from history |
| `POST` | `/api/dataset/upload`| Upload custom CSV dataset for retraining |

---

## 8. Machine Learning Model Evaluation Summary

| Model | Architecture | Test MAE (Lakhs) | Test RMSE (Lakhs) | Test R² Score |
| :--- | :--- | :--- | :--- | :--- |
| **Random Forest Regressor** | 100 Trees (depth=16) | **15.24** | **24.81** | **0.884** |
| **Ridge Regression** | L2 Regularized ($\alpha=1.0$) | 18.62 | 29.45 | 0.838 |
| **Linear Regression (OLS)** | Ordinary Least Squares | 19.85 | 31.72 | 0.815 |

---

## 9. Legal & Financial Disclaimer

Predictions provided by HomeWise AI are statistical approximations calculated from historical housing dataset records. They do not constitute an official appraisal, financial advice, or transaction guarantee. Real valuations require physical inspection, title validation, and builder credential verification.
