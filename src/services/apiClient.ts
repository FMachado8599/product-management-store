type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Primitive[] | Record<string, Primitive>;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

function buildQuery(query?: Record<string, QueryValue>): string {
  if (!query) return "";
  const qs = new URLSearchParams();

  const append = (key: string, val: Primitive) => {
    if (val === null || val === undefined) return;
    if (typeof val === "string" && val.trim() === "") return;
    if (typeof val === "boolean") qs.append(key, String(val));
    else qs.append(key, String(val));
  };

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((v) => append(key, v));
    } else if (value && typeof value === "object") {
      for (const [subKey, subVal] of Object.entries(value)) {
        append(`${key}.${subKey}`, subVal as Primitive);
      }
    } else {
      append(key, value as Primitive);
    }
  }

  const s = qs.toString();
  return s ? `?${s}` : "";
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
  cache?: RequestCache;
};

class HttpError extends Error {
  status: number;
  url: string;
  body?: string;
  constructor(message: string, status: number, url: string, body?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  externalSignal?: AbortSignal
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new DOMException("Timeout", "TimeoutError")),
    timeoutMs
  );

  const signals = [controller.signal, externalSignal].filter(
    Boolean
  ) as AbortSignal[];
  const composite = new AbortController();

  const onAbort = () => composite.abort();

  signals.forEach((s) => {
    if (s.aborted) onAbort();
    else s.addEventListener("abort", onAbort, { once: true });
  });

  try {
    return await fetch(url, { ...init, signal: composite.signal });
  } finally {
    clearTimeout(timeoutId);
    signals.forEach((s) => s.removeEventListener("abort", onAbort));
  }
}

async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  if (!API_BASE)
    throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en .env.local");

  const {
    method = "GET",
    query,
    body,
    headers,
    timeoutMs = 20_000,
    signal,
    cache,
  } = opts;

  const url = `${API_BASE}${path}${buildQuery(query)}`;
  const init: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: cache ?? "no-store",
  };

  const res = await fetchWithTimeout(url, init, timeoutMs, signal);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new HttpError(
      `HTTP ${res.status} ${res.statusText} en ${url}`,
      res.status,
      url,
      text || undefined
    );
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;

  const text = await res.text().catch(() => "");
  return text as T;
}

export const apiClient = {
  get<T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...opts, method: "GET" });
  },
  post<T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">
  ) {
    return request<T>(path, { ...opts, method: "POST", body });
  },
  put<T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">
  ) {
    return request<T>(path, { ...opts, method: "PUT", body });
  },
  patch<T>(
    path: string,
    body?: unknown,
    opts?: Omit<RequestOptions, "method" | "body">
  ) {
    return request<T>(path, { ...opts, method: "PATCH", body });
  },
  delete<T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...opts, method: "DELETE" });
  },
};

export { HttpError, buildQuery, API_BASE };
