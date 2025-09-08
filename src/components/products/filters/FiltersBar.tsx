"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setQuery,
  selectFilters,
  fetchProducts,
} from "@/store/slices/productsSlice";

export default function FiltersBar() {
  const dispatch = useAppDispatch();
  const { q } = useAppSelector(selectFilters);

  return (
    <div className="flex gap-2">
      <input
        className="input"
        placeholder="Buscar…"
        value={q}
        onChange={(e) => dispatch(setQuery(e.target.value))}
      />
      <button className="btn" onClick={() => dispatch(fetchProducts())}>
        Aplicar
      </button>
    </div>
  );
}
