const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiGet<T>(
  path: string,
  params?: Record<string, any>
): Promise<T> {
  if (!BASE_URL) throw new Error("Falta NEXT_PUBLIC_API_BASE_URL");
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
