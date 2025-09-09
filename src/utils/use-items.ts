// src/lib/use-items.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { Api } from "@/lib/api";
import type { Estado, Prioridad, Product } from "@/lib/interfaces";

type Maybe<T> = T | "";

export interface ItemsFilters {
  q: string;
  estado: Maybe<Estado>;
  prioridad: Maybe<Prioridad>;
  page: number;
  size: number;
}

const DEFAULT_FILTERS: ItemsFilters = {
  q: "",
  estado: "",
  prioridad: "",
  page: 1,
  size: 25,
};

export function useItems(initial?: Partial<ItemsFilters>) {
  const [filters, setFilters] = useState<ItemsFilters>({
    ...DEFAULT_FILTERS,
    ...(initial || {}),
  });
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = (immediate = false) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const run = async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      setError(null);
      try {
        const { q, estado, prioridad, page, size } = filters;
        const data = await Api.getItems({ q, estado, prioridad, page, size });
        setItems(data || []);
      } catch (e: any) {
        setError(e?.message || "No se pudo cargar el listado");
      } finally {
        setLoading(false);
      }
    };
    if (immediate) run();
    else debounceRef.current = setTimeout(run, 250);
  };

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.q,
    filters.estado,
    filters.prioridad,
    filters.page,
    filters.size,
  ]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const setFilter = <K extends keyof ItemsFilters>(
    key: K,
    value: ItemsFilters[K]
  ) => {
    setFilters((f) => {
      const next = { ...f, [key]: value } as ItemsFilters;
      if (key !== "page") next.page = 1;
      return next;
    });
  };

  const refresh = () => load(true);
  return {
    items,
    setItems,
    loading,
    error,
    filters,
    setFilter,
    refresh,
    setFilters,
  };
}
