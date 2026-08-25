# Product architecture

## System shape

```text
Browser / search crawler
        │
        ├── Next.js App Router
        │   ├── public SSR/SSG marketing and catalog
        │   ├── client booking, cart and account interactions
        │   └── authenticated admin workspace
        │
        └── ASP.NET Core 8 API (`/api/v1`)
            ├── Identity + JWT + roles
            ├── booking and availability services
            ├── catalog/content/commerce endpoints
            ├── Stripe + notification adapters
            └── EF Core → SQL Server
```

The public experience is statically optimized for search and resilience. Transactional surfaces use client components behind narrow typed adapters. The API owns availability, booking integrity, payments, permissions, loyalty, inventory, and reporting rules.

## Frontend modules

| Module | Responsibility |
|---|---|
| `components/layout` | responsive global navigation, footer, page heroes, contact actions |
| `components/booking` | booking state, validation, slots, deposit summary, confirmation |
| `components/shop` | products, persistent cart, checkout, order confirmation |
| `components/account` | customer profile, appointments, rewards, orders, gift cards, auth |
| `components/admin` | operational shell, data tables, modals, calendars, charts, settings |
| `components/forms` | validated lead, group, career, review and newsletter capture |
| `lib/api-client.ts` | typed HTTP boundary and normalized API errors |
| `lib/site-data.ts` | editorial seed/fallback content and shared navigation models |

## API boundaries

| Area | Representative endpoints |
|---|---|
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Catalog | `GET /catalog/categories`, `GET /catalog/services`, `GET /catalog/services/{slug}`, `GET /catalog/add-ons` |
| Staff | `GET /staff`, `GET /staff/{slug}` |
| Availability | `GET /availability?serviceId=&staffId=&date=` |
| Booking | `POST /bookings`, `GET /bookings/confirmation/{number}` |
| Customer | `GET/PUT /account/profile`, appointments/reschedule/cancel, loyalty, orders |
| Content | reviews, blog, gallery, memberships, offers, contact, newsletter |
| Shop | products, product detail, checkout |
| Admin | summary, appointments/status, customers, staff time-off |

The OpenAPI explorer in Development documents exact contracts and response codes.

## Relational data model

### Identity and customers

- `ApplicationUsers`, `ApplicationRoles`, Identity joins/claims/tokens
- `UserAddresses`
- `FavoriteServices`
- `SavedLooks`

### Catalog and staff

- `ServiceCategories` → many `Services`
- `Services` ↔ many `AddOns` through `ServiceAddOns`
- `StaffMembers` ↔ many `Services` through `StaffServices`
- `StaffAvailability`
- `StaffTimeOff`

### Scheduling

- `Appointments` belongs to a customer/guest and staff member
- `AppointmentItems` snapshots booked service duration and price
- `AppointmentItemAddOns` snapshots selected extras
- schedule validation combines service duration, staff capabilities, recurring availability, time off, blocked periods, existing appointments, lead time, and booking horizon

### Reputation and content

- `Reviews`
- `BlogPosts`
- `ContentPages`
- `GalleryImages`
- `ContactInquiries`
- `NewsletterSubscribers`

### Commerce

- `ProductCategories` → `Products` → `ProductImages`
- `ShoppingCarts` → `CartItems`
- `Orders` → `OrderItems`
- inventory and money values are server-owned and snapshotted at checkout

### Retention and gifting

- `MembershipPlans` → `MembershipSubscriptions`
- `LoyaltyTransactions` immutable points ledger
- `GiftCards` → `GiftCardTransactions`
- `Coupons`

## Booking flow

1. Web loads active categories/services and available add-ons.
2. Guest selects service and optional artist.
3. Availability API calculates valid start times in salon time, returning UTC values.
4. Add-ons extend duration and are revalidated against the selected staff member.
5. Guest details and notes are validated; server rechecks the slot inside the booking transaction.
6. When a deposit is required, the payment gateway creates/confirms a Stripe PaymentIntent using an idempotency key.
7. Appointment, item price snapshots, add-ons, payment state, and audit fields are committed.
8. Email/SMS notifications are queued through `INotificationSender`.
9. Confirmation is retrievable only with booking number plus normalized guest email, or from the authenticated account.

## Authentication and authorization

- ASP.NET Identity stores password hashes and account/role relationships.
- Login returns a short-lived signed JWT containing user ID and roles.
- The web client keeps the access token in a secure session strategy; production should prefer an encrypted `HttpOnly`, `Secure`, `SameSite` cookie/BFF over local storage.
- Rate limiting, strict DTO validation, normalized API errors, HTTPS redirection, and allow-listed credentialed CORS are configured.
- Admin actions require authenticated role policies; payment webhooks must verify Stripe signatures and be idempotent.

## Recommended roles

| Role | Access |
|---|---|
| `Customer` | own profile, appointments, favorites, rewards, gift cards, orders |
| `Technician` | own schedule, assigned appointments, guest notes permitted for service delivery |
| `Receptionist` | bookings, customer lookup, check-in, payments, rescheduling |
| `ContentManager` | blog, gallery, reviews, promotions, public page content |
| `InventoryManager` | products, stock, fulfillment, retail reporting |
| `SalonManager` | staff, services, schedules, memberships, gifting, reports |
| `Administrator` | all operational configuration and role management |

Use least privilege and record all sensitive admin mutations in an audit log before production.

## Payment and notification adapters

- `IPaymentGateway` isolates Stripe from booking/shop business logic.
- Use PaymentIntents and Stripe Elements; the server accepts only Stripe IDs/tokens, never raw card numbers.
- Add a signed `/webhooks/stripe` handler for asynchronous success, failure, dispute and refund events.
- `INotificationSender` currently logs; production implementations can use SendGrid and Twilio, preferably through a durable queue with retries and dead-letter tracking.

## Production checklist

- Create and review EF Core migrations; use a limited SQL login.
- Move secrets to Azure Key Vault, AWS Secrets Manager, or equivalent.
- Add refresh-token/session revocation and email verification/reset workflows.
- Wire the Next.js transactional screens to `api-client.ts` and protect customer/admin routes at the server boundary.
- Add Stripe webhooks, taxes/shipping logic, refund handling and payment reconciliation.
- Add background jobs for reminders, abandoned carts, waitlists and membership billing.
- Put media in an object store/CDN and add admin upload scanning.
- Add structured logging, tracing, error reporting, uptime checks and backup/restore drills.
- Add Playwright end-to-end coverage for booking, auth, checkout, cancellation and permissions.
- Complete accessibility testing (keyboard, screen reader, contrast, zoom) and legal review.

## Future enhancements

- Multi-location support with location-aware catalog, teams, tax and time zones
- Smart waitlist and automatic slot-fill offers
- Group-booking proposals, deposits and guest self-selection
- Artist commissions, payroll exports and tip reporting
- Photo-based nail consultation and inspiration matching
- POS integration, barcode inventory and low-stock purchase orders
- Customer referral journeys and tiered loyalty experiments
- Localization, multiple currencies and region-specific policies
- Consent-aware personalization and marketing automation

