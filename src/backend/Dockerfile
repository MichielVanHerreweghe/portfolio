# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY Portfolio.slnx ./
COPY src/Portfolio.Api/Portfolio.Api.csproj src/Portfolio.Api/
COPY src/Portfolio.Infrastructure/Portfolio.Infrastructure.csproj src/Portfolio.Infrastructure/
RUN dotnet restore src/Portfolio.Api/Portfolio.Api.csproj

COPY src/Portfolio.Api/ src/Portfolio.Api/
COPY src/Portfolio.Infrastructure/ src/Portfolio.Infrastructure/
RUN dotnet publish src/Portfolio.Api/Portfolio.Api.csproj \
    --configuration "$BUILD_CONFIGURATION" \
    --no-restore \
    --output /app/publish \
    -p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble-chiseled-extra AS runtime
WORKDIR /app

COPY --from=build /app/publish .

USER $APP_UID

EXPOSE 8080

ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
