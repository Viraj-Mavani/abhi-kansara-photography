# dev.ps1 - Abhi Kansara Photography Development Startup Script

Write-Host ">> Starting Abhi Kansara Photography Development Environment..." -ForegroundColor Cyan

# 1. Start Docker Containers (Redis)
Write-Host ">> Starting Docker containers..." -ForegroundColor Yellow
docker compose up -d

# 2. Start .NET Backend API (in a new window)
Write-Host ">> Launching .NET Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server/AbhiKansara.API; dotnet run"

# 3. Start Next.js Frontend
Write-Host ">> Launching Next.js Frontend..." -ForegroundColor Yellow
npm run dev
