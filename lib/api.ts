// lib/api.ts
import type { Product } from "./interfaces"; // o "./interfaces" si lo dejaste .ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export class ApiError extends Error {
  status: number;
  info?: unknown;
  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

function join(base: string, path: string) {
  const left = (base || "").replace(/\/+$/, "");
  const right = (path || "").replace(/^\/+/, "");
  return `${left}/${right}`;
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

async function apiFetch<T>(
  path: string,
  opts: {
    method?: Method;
    body?: unknown;
    signal?: AbortSignal;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const url = join(BASE_URL, path);
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed ${res.status} ${res.statusText}`;
    throw new ApiError(msg, res.status, data);
  }
  return data as T;
}

export const Api = {
  getItems(
    params?: Partial<{
      estado: string;
      prioridad: string;
      q: string;
      page: number;
      size: number;
    }>
  ) {
    const s = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) =>
      v != null && v !== "" ? s.set(k, String(v)) : null
    );
    const qs = s.toString();
    return apiFetch<Product[]>(`/items${qs ? `?${qs}` : ""}`);
  },
  createItem(payload: Partial<Product>) {
    return apiFetch<Product>("/items", { method: "POST", body: payload });
  },
  updateItem(id: string, patch: Partial<Product>) {
    return apiFetch<Product>(`/items/${id}`, { method: "PATCH", body: patch });
  },
  deleteItem(id: string) {
    return apiFetch<{ ok: true }>(`/items/${id}`, { method: "DELETE" });
  },
  resolveByUrl(url: string, signal?: AbortSignal) {
    const qs = new URLSearchParams({ url });
    return apiFetch<Partial<Product>>(`/resolve?${qs.toString()}`, { signal });
  },
};

export { apiFetch };
