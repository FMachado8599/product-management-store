// src/services/products.service.ts
import { apiClient } from "@/services/apiClient";
import type { ListProductsParams, ProductsResponse } from "@/types/products";

/**
 * Construye el query string a partir de los params anidados
 */
function buildProductsQuery(params: ListProductsParams) {
  const query: Record<string, string | boolean | number | undefined> = {};

  // filtros anidados
  if (params.filters?.q?.trim()) {
    query.q = params.filters.q.trim();
  }
  if (params.filters?.category?.trim()) {
    query.category = params.filters.category.trim();
  }
  if (typeof params.filters?.inStock === "boolean") {
    query.inStock = params.filters.inStock;
  }

  // pageSize es obligatorio según tu type
  query.pageSize = params.pageSize;

  // Regla: cursor y page no coexisten
  if (params.cursor?.trim()) {
    query.cursor = params.cursor.trim();
  } else {
    query.page = params.page ?? 1;
  }

  return query;
}

/**
 * listProducts → hace GET a /products con query armado.
 * Usa apiClient y devuelve ProductsResponse sin modificar.
 */
export async function listProducts(
  params: ListProductsParams,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const query = buildProductsQuery(params);

  return apiClient.get<ProductsResponse>("/products", {
    query,
    signal,
  });
}
