# Maison Élan API

ASP.NET Core 8 REST API for catalog, staff availability, bookings, customer accounts, content, shop checkout, loyalty, gifting, and salon administration.

## Run locally

```powershell
dotnet restore .\Salon.Api.csproj
dotnet run --project .\Salon.Api.csproj
```

Local endpoints:

- HTTP: `http://localhost:5080`
- HTTPS: `https://localhost:7080`
- Swagger (Development): `/swagger`
- Health: `/health`

The committed development configuration uses SQL Server LocalDB and does not initialize a database by default. For a disposable local demo:

```powershell
$env:Database__InitializeOnStartup = "true"
$env:Database__SeedDemoData = "true"
dotnet run --project .\Salon.Api.csproj
```

Use EF Core migrations—not `EnsureCreated`—for staging and production rollout.

## Configuration

Use environment variables, user secrets, or a managed secret store for:

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key` (at least 32 random bytes)
- `Stripe__SecretKey`
- email/SMS provider credentials
- production CORS origins

`appsettings.Example.json` shows the full configuration shape. Raw card numbers are never accepted; the API expects Stripe identifiers.

## Verification

```powershell
dotnet build .\Salon.Api.csproj --no-restore
```

The project builds against `net8.0` with zero warnings and zero errors. See `docs/API.md` for endpoint contracts and `docs/salon-api.http` for request examples.

