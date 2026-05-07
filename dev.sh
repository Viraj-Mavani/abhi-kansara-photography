#!/bin/bash

echo -e "\e[36m>> Starting Abhi Kansara Photography Development Environment...\e[0m"

# 1. Start Docker Containers (Redis)
echo -e "\e[33m>> Starting Docker containers...\e[0m"
docker compose up -d

# 2. Start .NET Backend API (in a new window)
# Git Bash uses 'start' to trigger a new Windows process
echo -e "\e[33m>> Launching .NET Backend API in new window...\e[0m"
start powershell -Command "cd server/AbhiKansara.API; dotnet run"

# 3. Start Next.js Frontend
echo -e "\e[33m>> Launching Next.js Frontend...\e[0m"
npm run dev
