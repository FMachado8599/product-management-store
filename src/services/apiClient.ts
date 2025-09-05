export const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function http<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
