// src/components/products/filters/FiltersBar.tsx
"use client";
import { useEffect, useState } from "react";
import { useProductsStore } from "@store/products.store";

export default function FiltersBar() {
  const setFilters = useProductsStore((s) => s.setFilters);
  const fetchProducts = useProductsStore.getState().fetch; // ref estable
  const [q, setQ] = useState("");

  // Debounce de búsqueda
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters({ q });
      fetchProducts();
    }, 350);
    return () => clearTimeout(t);
  }, [q, setFilters]); // sin fetch en deps

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar…"
      />
      <select
        onChange={(e) => {
          setFilters({ estado: e.target.value || undefined });
          fetchProducts();
        }}
      >
        <option value="">Estado</option>
        <option value="pendiente">Pendiente</option>
        <option value="en_progreso">En progreso</option>
        <option value="hecho">Hecho</option>
      </select>
      <select
        onChange={(e) => {
          setFilters({ prioridad: e.target.value || undefined });
          fetchProducts();
        }}
      >
        <option value="">Prioridad</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
        <option value="urgente">Urgente</option>
      </select>
    </div>
  );
}
