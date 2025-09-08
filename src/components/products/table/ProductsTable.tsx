// src/features/products/ProductsTable.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFirstPage,
  fetchNextPage,
} from "@/features/products/products.thunks";
import {
  selectItems,
  selectNextCursor,
  selectStatus,
} from "@/features/products/products.selectors";
import type { AppDispatch } from "@/store";

export default function ProductsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectItems);
  const nextCursor = useSelector(selectNextCursor);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchFirstPage());
  }, [dispatch]);

  return (
    <div>
      <ul>
        {items.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      {nextCursor && (
        <button
          disabled={status === "loading"}
          onClick={() => dispatch(fetchNextPage())}
        >
          {status === "loading" ? "Cargando..." : "Cargar más"}
        </button>
      )}
    </div>
  );
}
