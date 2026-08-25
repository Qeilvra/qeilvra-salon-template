# Maison Élan — Luxury Nail Atelier Platform

A complete salon product built from the supplied visual reference: a conversion-focused public website, multi-step booking experience, customer account, commerce flow, content system, and practical admin workspace. The UI uses an original black, blush, cream, and champagne-gold design system with project-local generated photography.

## Stack

- **Web:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- **API:** ASP.NET Core 8 Web API, Entity Framework Core 8, ASP.NET Identity, JWT
- **Data:** SQL Server / LocalDB
- **Payments:** Stripe-ready payment gateway and checkout seams
- **Notifications:** pluggable email/SMS notification interface for SendGrid/Twilio
- **Visualization:** Recharts for operational reporting

## What is included

- Premium responsive homepage with all requested conversion sections
- Service catalog, filters, transparent pricing, and service-detail pages
- Lookbook with filters, saved looks, and full-screen previews
- Artist directory and individual technician profiles
- Reviews, memberships/rewards, gift-card builder, promotions, FAQ, contact, bridal/groups, careers, and policy pages
- Product shop, detail pages, persistent cart, secure-checkout UI, and order confirmation
- Five-step booking journey with service, add-ons, artist, live-style date/time selection, customer details, deposit, and confirmation
- Customer account for appointments, rescheduling/cancellation, saved looks, loyalty, profile/addresses, orders, and gift cards
- Admin workspace for appointments, customers, services/categories, staff, content, commerce, offers, memberships, gifting, reports, and settings
- SEO metadata, Open Graph defaults, sitemap, robots rules, responsive navigation, accessible focus states, and reduced-motion support
- .NET API with relational entities, seeded-data support, authentication, rate limiting, validation, error middleware, Swagger, health checks, and role-protected admin endpoints

## Quick start

### Frontend

```powershell
Copy-Item .env.example .env.local
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

Useful checks:

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd start
```

### API

The default development configuration uses SQL Server LocalDB on Windows.

```powershell
dotnet restore .\server\Salon.Api.csproj
dotnet run --project .\server\Salon.Api.csproj
```

The API runs at `http://localhost:5080`; Swagger is available at `/swagger` in Development and health is available at `/health`.

To initialize and seed a local database, set these development values (prefer user secrets or environment variables):

```text
Database__InitializeOnStartup=true
Database__SeedDemoData=true
```

For a production SQL Server connection, copy `server/appsettings.Example.json` into an environment-specific configuration and provide the connection string and JWT key through a secret store. Never commit real Stripe, JWT, database, SendGrid, or Twilio secrets.

## Route map

### Public and commerce

`/`, `/about`, `/services`, `/services/[slug]`, `/pricing`, `/gallery`, `/team`, `/team/[slug]`, `/reviews`, `/membership`, `/gift-cards`, `/offers`, `/shop`, `/shop/[slug]`, `/cart`, `/checkout`, `/blog`, `/blog/[slug]`, `/faq`, `/contact`, `/group-bookings`, `/careers`, `/policies/privacy`, `/policies/terms`, `/policies/cancellation`, `/policies/refunds`

### Booking and authentication

`/book/service`, `/book/add-ons`, `/book/technician`, `/book/date-time`, `/book/details`, `/book/confirmation`, `/auth/login`, `/auth/register`, `/auth/forgot-password`

### Customer

`/account`, `/account/appointments`, `/account/appointments/manage`, `/account/wishlist`, `/account/rewards`, `/account/profile`, `/account/orders`, `/account/gift-cards`

### Admin

`/admin`, `/admin/appointments`, `/admin/customers`, `/admin/services`, `/admin/categories`, `/admin/staff`, `/admin/reviews`, `/admin/blog`, `/admin/products`, `/admin/promotions`, `/admin/memberships`, `/admin/gift-cards`, `/admin/reports`, `/admin/settings`

## Project structure

```text
├── public/images/                Original salon imagery
├── src/app/                      App Router pages and layouts
│   ├── (site)/                   Public site, shop, content, policies
│   ├── (portal)/                 Customer account and authentication
│   ├── admin/                    Admin application
│   └── book/                     Distraction-free booking journey
├── src/components/               Booking, account, admin, shop, cards, forms, UI
├── src/lib/                      Seed content, typed API transport, utilities
├── server/                       ASP.NET Core 8 API
│   ├── Controllers/              REST endpoints
│   ├── Data/                     EF Core context and seed workflow
│   ├── Domain/                   Entities and enums
│   ├── DTOs/                     Validated request/response contracts
│   ├── Infrastructure/           Options, claims, error middleware
│   └── Services/                 Booking, availability, auth, shop, payments
└── docs/ARCHITECTURE.md          Data model, flows, roles, production notes
```

## Integration status

The project runs as a complete interactive product preview using realistic local content and browser state. The typed API client in `src/lib/api-client.ts` mirrors the included .NET endpoints. Before launch, switch account, booking, checkout, and admin actions from preview state to these adapters; configure SQL Server migrations, Stripe Elements/PaymentIntents, SendGrid/Twilio credentials, persistent file storage, and production monitoring.

The checkout and deposit forms intentionally do **not** collect or transmit real card details in preview mode. Use Stripe-hosted Elements in production so sensitive payment data never passes through this application.

## Verification

- `npm.cmd run typecheck` — passes
- `npm.cmd run build` — passes; 73 routes/pages generated
- `dotnet build server/Salon.Api.csproj` — see the API verification note in `server/README.md`

