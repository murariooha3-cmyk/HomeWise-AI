import React, { useState } from 'react';
import { Database, Cpu, ShieldCheck, Terminal, AlertTriangle, CheckCircle2, Copy, Check } from 'lucide-react';
import { DatasetSummary, ModelMetricComparison } from '../types';

interface AboutProps {
  datasetSummary: DatasetSummary;
  modelMetrics: ModelMetricComparison[];
}

export const AboutModelPage: React.FC<AboutProps> = ({ datasetSummary, modelMetrics }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const powershellCommands = `# 1. Create and activate Python virtual environment
cd backend
python -m venv venv
.\\venv\\Scripts\\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train ML models & generate joblib pipeline
python train_model.py

# 4. Run automated test suite
pytest tests/test_pipeline.py -v

# 5. Start FastAPI development server
uvicorn main:app --reload --port 8000`;

  const bashCommands = `# 1. Create and activate Python virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train ML models & generate joblib pipeline
python3 train_model.py

# 4. Run automated test suite
pytest tests/test_pipeline.py -v

# 5. Start FastAPI development server
uvicorn main:app --reload --port 8000`;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Machine Learning Architecture & Data Engineering</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About the Machine Learning Model
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Complete documentation of dataset provenance, data cleaning audit trail, regression pipelines, evaluation metrics, and local execution instructions.
        </p>
      </div>

      {/* 1. Dataset Provenance & Attribution */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            01. Dataset Provenance & Ingestion
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The primary training corpus is the openly available <strong>Bengaluru House Price Data</strong> (13,320 initial records). Features include <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">area_type</code>, <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">availability</code>, <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">location</code>, <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">size</code> (BHK), <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">society</code>, <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">total_sqft</code>, <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">bath</code>, <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">balcony</code>, and target <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded">price</code> (in Lakhs INR).
        </p>

        {/* Cleaning Audit Table */}
        <div className="mt-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
            Data Quality & Outlier Filtration Audit Trail
          </h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Pipeline Stage</th>
                  <th className="p-3">Removed</th>
                  <th className="p-3">Remaining</th>
                  <th className="p-3">Filtration Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {datasetSummary.cleaningAudit.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {row.step}
                    </td>
                    <td className="p-3 font-mono text-red-600">
                      {row.removedRows > 0 ? `-${row.removedRows}` : '0'}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-600">
                      {row.remainingRows.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {row.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Model Evaluation Benchmarks */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            02. Model Comparison & Regression Metrics
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Three candidate algorithms were trained on the preprocessed 80% split and independently evaluated on the held-out 20% test partition (2,373 properties). The <strong>Random Forest Regressor</strong> achieved the highest explanatory power (R² = 0.884) by modeling non-linear interactions between locality density and area tiers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {modelMetrics.map((m) => (
            <div
              key={m.name}
              className={`p-4 rounded-xl border ${
                m.name.includes('Random Forest')
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {m.name}
              </div>
              <div className="text-[11px] text-slate-400 mb-3">{m.type}</div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">R² Score:</span>
                  <span className="font-bold text-emerald-600">{m.r2.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MAE:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.mae} Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RMSE:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.rmse} Lakhs</span>
                </div>
              </div>

              <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-500 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            Handling of Unseen or Rare Localities:
          </div>
          <p className="text-[11px] leading-relaxed">
            Localities with fewer than 10 occurrences in the training set are grouped into an aggregate <code className="text-slate-800 dark:text-slate-200">"Other"</code> category during scikit-learn OneHotEncoder fitting (<code className="text-slate-800 dark:text-slate-200">handle_unknown='ignore'</code>). Unseen localities default to the citywide baseline rate to prevent extreme variance.
          </p>
        </div>
      </section>

      {/* 3. Local Execution Guide */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            03. Running the Python Backend Locally
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The complete Python backend code (<code className="text-slate-800 dark:text-slate-200">main.py</code>, <code className="text-slate-800 dark:text-slate-200">train_model.py</code>, <code className="text-slate-800 dark:text-slate-200">preprocess.py</code>, <code className="text-slate-800 dark:text-slate-200">predict.py</code>, <code className="text-slate-800 dark:text-slate-200">analytics.py</code>) is located in the <code className="text-slate-800 dark:text-slate-200">/backend</code> directory.
        </p>

        {/* Windows PowerShell Tab */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Windows PowerShell:</span>
            <button
              onClick={() => copyToClipboard(powershellCommands, 'ps')}
              className="text-emerald-600 hover:underline flex items-center gap-1 text-[11px]"
            >
              {copiedSnippet === 'ps' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSnippet === 'ps' ? 'Copied' : 'Copy PowerShell'}
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
            {powershellCommands}
          </pre>
        </div>

        {/* Linux / macOS */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>macOS / Linux Terminal:</span>
            <button
              onClick={() => copyToClipboard(bashCommands, 'bash')}
              className="text-emerald-600 hover:underline flex items-center gap-1 text-[11px]"
            >
              {copiedSnippet === 'bash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSnippet === 'bash' ? 'Copied' : 'Copy Bash'}
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
            {bashCommands}
          </pre>
        </div>
      </section>

      {/* 4. Limitations & Disclaimers */}
      <section className="bg-amber-50/60 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold">
            04. Scope, Limitations & Regulatory Disclaimer
          </h2>
        </div>
        <ul className="text-xs text-amber-900 dark:text-amber-300/90 space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong>Historical Temporal Horizon:</strong> Property prices reflect historical transaction records. They do not account for post-2023 inflationary escalations, Namma Metro Phase 2 expansions, or sudden zoning modifications unless updated in dataset files.
          </li>
          <li>
            <strong>Non-Financial / Non-Legal Notice:</strong> HomeWise AI is an educational, technical, and analytical decision-support system. It is not a certified real estate appraisal or financial advisory service.
          </li>
          <li>
            <strong>Omitted Micro-Variables:</strong> Premium variables such as specific unit vastu orientation, high-floor premium (floor rise charge), clubhouse amenities, builder grade (Grade A vs unbranded), and khata certification (A-Khata vs B-Khata) are unobserved in the public dataset.
          </li>
        </ul>
      </section>
    </div>
  );
};
