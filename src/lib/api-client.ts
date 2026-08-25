/**
 * Typed transport for the ASP.NET Core API.
 *
 * Marketing pages intentionally ship with static seed content so they remain
 * indexable and resilient. Account, booking, checkout and admin screens can
 * call these adapters when the API environment is enabled.
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
  query?: Record<string, string | number | boolean | undefined | null>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_URL}/${path.replace(/^\//, "")}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) {
    throw new ApiError(
      String(payload?.message ?? payload?.title ?? "The request could not be completed."),
      response.status,
      typeof payload?.code === "string" ? payload.code : undefined,
      payload?.errors,
    );
  }
  return payload as T;
}

export type AuthResponse = {
  accessToken: string;
  expiresAtUtc: string;
  user: { id: string; firstName: string; lastName: string; email: string; phone?: string; loyaltyPoints: number; roles: string[] };
};

export type CatalogService = {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
};

export type BookingResponse = {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  staffId: string;
  staffName: string;
  startsAtUtc: string;
  endsAtUtc: string;
  subtotal: number;
  discountAmount: number;
  depositAmount: number;
  total: number;
  customerEmail: string;
};

export const api = {
  auth: {
    login: (body: { email: string; password: string }) => request<AuthResponse>("auth/login", { method: "POST", body }),
    register: (body: { firstName: string; lastName: string; email: string; password: string; phone?: string; marketingEmailsOptIn: boolean; smsOptIn: boolean }) => request<AuthResponse>("auth/register", { method: "POST", body }),
    me: (token: string) => request<AuthResponse["user"]>("auth/me", { token }),
  },
  catalog: {
    categories: () => request<unknown[]>("catalog/categories"),
    services: (query?: { category?: string; search?: string }) => request<CatalogService[]>("catalog/services", { query }),
    service: (slug: string) => request<CatalogService>(`catalog/services/${slug}`),
    addOns: () => request<unknown[]>("catalog/add-ons"),
    staff: () => request<unknown[]>("staff"),
    staffMember: (slug: string) => request<unknown>(`staff/${slug}`),
    availability: (query: { serviceId: string; staffId?: string; date: string }) => request<unknown[]>("availability", { query }),
  },
  booking: {
    create: (body: unknown) => request<BookingResponse>("bookings", { method: "POST", body }),
    confirmation: (number: string, email: string) => request<BookingResponse>(`bookings/confirmation/${number}`, { query: { email } }),
  },
  content: {
    reviews: () => request<unknown[]>("content/reviews"),
    blog: () => request<unknown[]>("content/blog"),
    gallery: () => request<unknown[]>("content/gallery"),
    memberships: () => request<unknown[]>("content/memberships"),
    offers: () => request<unknown[]>("content/offers"),
    contact: (body: unknown) => request<void>("content/contact", { method: "POST", body }),
    newsletter: (email: string) => request<void>("content/newsletter", { method: "POST", body: { email } }),
  },
  shop: {
    products: (query?: { category?: string; search?: string }) => request<unknown[]>("shop/products", { query }),
    product: (slug: string) => request<unknown>(`shop/products/${slug}`),
    checkout: (body: unknown, token?: string) => request<unknown>("shop/checkout", { method: "POST", body, token }),
  },
  account: {
    profile: (token: string) => request<unknown>("account/profile", { token }),
    updateProfile: (token: string, body: unknown) => request<unknown>("account/profile", { method: "PUT", token, body }),
    appointments: (token: string) => request<unknown[]>("account/appointments", { token }),
    reschedule: (token: string, id: string, body: unknown) => request<BookingResponse>(`account/appointments/${id}/reschedule`, { method: "POST", token, body }),
    cancel: (token: string, id: string, reason: string) => request<void>(`account/appointments/${id}/cancel`, { method: "POST", token, body: { reason } }),
    loyalty: (token: string) => request<unknown>("account/loyalty", { token }),
    orders: (token: string) => request<unknown[]>("account/orders", { token }),
  },
  admin: {
    summary: (token: string) => request<unknown>("admin/summary", { token }),
    appointments: (token: string, query?: Record<string, string>) => request<unknown[]>("admin/appointments", { token, query }),
    customers: (token: string, query?: Record<string, string>) => request<unknown[]>("admin/customers", { token, query }),
    updateAppointmentStatus: (token: string, id: string, status: string) => request<void>(`admin/appointments/${id}/status`, { method: "PATCH", token, body: { status } }),
  },
};

