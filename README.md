<div align="center">

# 🔍 GigLens
### India's First Gig Worker Financial Health Audit Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-giglens.vercel.app-blue?style=for-the-badge&logo=vercel)](https://giglens-74r9.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-jessicamathew31--coder-black?style=for-the-badge&logo=github)](https://github.com/jessicamathew31-coder/giglens)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![SQLite](https://img.shields.io/badge/SQLite-3.46-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org)

*A production-grade financial analytics project that quantifies the financial vulnerability of India's 23.5 million gig workers.*

[**Live Demo →**](https://giglens-74r9.vercel.app)

</div>

---

## 📸 Screenshots

### Landing Page
![GigLens Landing](./screenshots/(1)homepage.png)

### Live Analytics Dashboard
![GigLens Dashboard](./screenshots/(2)dashboard.png)

### Financial Health Calculator
![GigLens Calculator](./screenshots/(3)calculator.png)

### Report Page
![GigLens Report](./screenshots/(4)report.png)

### About Page
![GigLens About](./screenshots/(5)about.png)

---

## 🎯 The Problem

India's gig workers exist in a financial blind spot:

- **23.5 million** gig workers with zero institutional financial tracking
- **No platform** fully meets Fairwork India's basic fair work standards (2024)
- The average gig worker earns **below city minimum wage** after expenses

**GigLens was built to fill that gap.**

---

## 🚀 What It Does

| Feature | Description |
|---|---|
| **GigLens Score** | Personalised financial health score (0–100) across 5 dimensions |
| **Live Dashboard** | Platform and city-level risk analysis with deviation charts |
| **SQL Analysis** | SQLite-powered queries across 500 worker dataset |
| **Python Engine** | Scoring engine calibrated to real published research data |
| **Report Download** | Downloadable financial health report with recommendations |

---

## 📊 Key Findings

| Metric | Value |
|---|---|
| Average GigLens Score | **49.1 / 100** |
| Workers in Critical Risk | **45 (9%)** |
| Workers Vulnerable | **250 (50%)** |
| Workers Stable | **205 (41%)** |
| Most At-Risk Platform | **Ola (46.5 avg)** |
| Safest Platform | **Amazon Flex (51.2 avg)** |

---

## 🧮 Scoring Methodology

GigLens Score (0–100) =
Income Stability    (25%)  — Earnings vs city minimum wage

Expense Burden      (20%)  — Monthly expenses as % of earnings
Benefits Gap        (20%)  — Insurance + savings coverage
Crisis Resilience   (20%)  — Months of expenses in savings
Platform Risk       (15%)  — Fairwork India 2024 platform score
---

## 🏗️ Project Architecture

giglens/
├── data/
│   ├── gig_workers.csv          # 500-worker synthetic dataset
│   ├── scored_workers.json      # Scored output from Python engine
│   └── giglens.db               # SQLite database
├── scripts/
│   ├── generate_data.py         # Dataset generation script
│   ├── scoring_engine.py        # 5-dimension scoring model
│   ├── load_to_sqlite.py        # SQLite loader
│   └── analysis.py              # Python analysis + charts
├── src/
│   └── App.js                   # React frontend (5 pages)
└── screenshots/                 # App screenshots

---

## 🛠️ Tech Stack

**Data & Analysis**
- Python (pandas, matplotlib) — scoring engine and analysis
- SQLite — data warehouse with 2 tables, 500+ records
- SQL — window functions, GROUP BY, variance analysis

**Frontend**
- React 19 — 5-page SPA with persistent state
- Custom trail cursor and hover animations
- Divergent bar charts, trend lines, shadow deviation visualisation

**Deployment**
- Vercel — live React app
- GitHub — version control

---

## 📂 Data Sources

- PLFS Annual Reports (MoSPI)
- NITI Aayog Gig Economy Policy Brief 2022
- Fairwork India Reports 2022–2024
- IFAT Worker Survey Data
- Karnataka Gig Workers Bill 2023

---

## 🚀 Run Locally

```bash
git clone https://github.com/jessicamathew31-coder/giglens.git
cd giglens
python3 scripts/generate_data.py
python3 scripts/scoring_engine.py
python3 scripts/load_to_sqlite.py
npm install && npm start
```

---

## 👩‍💻 Built By

**Jessica Mathew**  
MBA Finance & Technology · MIT ADT University, Pune  
CBAP · CAP · Microsoft Project Management

---

<div align="center">

*Built to solve a real problem — not just for a portfolio.*

**[🔍 Try GigLens Live →](https://giglens-74r9.vercel.app)**

</div>
