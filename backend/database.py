"""
SQLite Database Storage for Prediction History
"""

import sqlite3
import os
import json
from typing import List, Dict, Any

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'homewise.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            location TEXT NOT NULL,
            total_sqft REAL NOT NULL,
            bhk INTEGER NOT NULL,
            bath INTEGER NOT NULL,
            balcony INTEGER NOT NULL,
            predicted_price_lakhs REAL NOT NULL,
            price_per_sqft INTEGER NOT NULL,
            model_used TEXT NOT NULL,
            raw_result TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_prediction_record(data: Dict[str, Any]):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR REPLACE INTO predictions 
        (id, timestamp, location, total_sqft, bhk, bath, balcony, predicted_price_lakhs, price_per_sqft, model_used, raw_result)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['id'],
        data['timestamp'],
        data['input']['location'],
        data['input']['total_sqft'],
        data['input']['bhk'],
        data['input']['bath'],
        data['input']['balcony'],
        data['predicted_price_lakhs'],
        data['price_per_sqft'],
        data['model_used'],
        json.dumps(data)
    ))
    conn.commit()
    conn.close()

def get_prediction_history(limit: int = 50) -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT raw_result FROM predictions ORDER BY timestamp DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [json.loads(row['raw_result']) for row in rows if row['raw_result']]

def delete_prediction_record(pred_id: str) -> bool:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM predictions WHERE id = ?', (pred_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
