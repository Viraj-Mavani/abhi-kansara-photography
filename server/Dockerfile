# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first for efficient caching
COPY ["AbhiKansaraPhotography.sln", "./"]
COPY ["AbhiKansara.API/AbhiKansara.API.csproj", "AbhiKansara.API/"]
COPY ["AbhiKansara.Core/AbhiKansara.Core.csproj", "AbhiKansara.Core/"]
COPY ["AbhiKansara.Infrastructure/AbhiKansara.Infrastructure.csproj", "AbhiKansara.Infrastructure/"]

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Publish the application
WORKDIR "/src/AbhiKansara.API"
RUN dotnet publish "AbhiKansara.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Railway uses the PORT environment variable
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AbhiKansara.API.dll"]
