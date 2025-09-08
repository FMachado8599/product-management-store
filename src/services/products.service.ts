import type { ListProductsParams, ProductsResponse } from "@/types/products";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function listProducts(
  { page = 1, pageSize, cursor = null, filters }: ListProductsParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  if (!BASE_URL) {
    throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en .env.local");
  }

  const params = new URLSearchParams({
    q: filters.q ?? "",
    pageSize: String(pageSize),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.inStock != null ? { inStock: String(filters.inStock) } : {}),
  });

  if (cursor) {
    params.set("cursor", cursor);
  } else {
    params.set("page", String(page));
  }

  const url = `${BASE_URL}/products?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    signal,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data = (await res.json()) as ProductsResponse;

  return {
    items: data.items ?? [],
    total: data.total ?? null,
    // si vino cursor en la request, page es null; si no, devolvemos el page que pediste
    page: data.page ?? (cursor ? null : page),
    pageSize: data.pageSize ?? pageSize,
    cursor: data.cursor ?? cursor ?? null,
    nextCursor: data.nextCursor ?? null,
  };
}
