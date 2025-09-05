// src/store/products.store.ts
import { create } from "zustand";
import { getProducts } from "@services/products.service";
import type { Product } from "@t/product";

type Filters = { q?: string; estado?: string; prioridad?: string };

type State = {
  items: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: Filters;
  page: number;
  pageSize: number;
};
type Actions = {
  setFilters: (f: Partial<Filters>) => void;
  setPage: (p: number) => void;
  fetch: () => Promise<void>;
};

export const useProductsStore = create<State & Actions>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: {},
  page: 1,
  pageSize: 20,

  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f }, page: 1 })),
  setPage: (p) => set({ page: p }),

  fetch: async () => {
    const { filters, page, pageSize } = get();
    try {
      set({ loading: true, error: null });
      const res = await getProducts({ ...filters, page, pageSize } as any);
      set({ items: res.items, total: res.total ?? res.items.length });
    } catch (e: any) {
      set({ error: e?.message ?? "Error al cargar" });
    } finally {
      set({ loading: false });
    }
  },
}));
