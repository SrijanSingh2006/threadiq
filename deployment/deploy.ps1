# Quick deploy script for Windows PowerShell
Write-Host "Starting ThreadIQ Production Stack..." -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not detected in your PATH. Running local development stack instead:" -ForegroundColor Yellow
    Write-Host "1. Backend: python -m uvicorn backend.app.main:app --reload --port 8000"
    Write-Host "2. Frontend: cd frontend; npm run dev"
    exit 0
}

docker-compose down
docker-compose build --no-cache
docker-compose up -d

Write-Host "ThreadIQ is running:" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:3000"
Write-Host "- Backend API & Swagger: http://localhost:8000/docs"
Write-Host "- Postgres Database: localhost:5432 (db: threadiq, user: postgres)"
