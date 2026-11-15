#!/usr/bin/env bash
set -e

echo "Starting ThreadIQ Enterprise Production Stack..."

if ! command -v docker &> /dev/null
then
    echo "Docker could not be found. Running in local Python/Node mode:"
    echo "1. Backend: python -m uvicorn backend.app.main:app --port 8000"
    echo "2. Frontend: cd frontend && npm run dev"
    exit 0
fi

docker compose down
docker compose build --no-cache
docker compose up -d

echo "ThreadIQ running successfully:"
echo "- Frontend UI: http://localhost:3000"
echo "- FastAPI Swagger Docs: http://localhost:8000/docs"
echo "- PostgreSQL: localhost:5432 (db: threadiq)"
