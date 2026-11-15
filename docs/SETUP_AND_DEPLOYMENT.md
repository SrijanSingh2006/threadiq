# Setup & Deployment Guide

## Prerequisites
- Python 3.11+
- Node.js 18+ & npm

## Local Development
1. Start Backend:
   ```bash
   python -m uvicorn backend.app.main:app --port 8000 --reload
   ```
2. Start Frontend:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open browser at `http://localhost:5173`.\n