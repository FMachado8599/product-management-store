import { http } from "@/services/apiClient";
import type { ApiList } from "@/types/api";
import type { Product } from "@/types/product";

export function getProducts(
  params: Record<string, string | number | boolean> = {}
) {
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return http<ApiList<Product>>(`/products${q ? `?${q}` : ""}`);
}
