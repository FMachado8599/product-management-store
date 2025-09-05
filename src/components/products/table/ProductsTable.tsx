// src/components/products/table/ProductsTable.tsx
"use client";
import { useEffect } from "react";
import { useProductsStore } from "@store/products.store";

export default function ProductsTable() {
  // NO devuelvas un objeto en el selector: crea referencias nuevas y re-renderiza.
  const items = useProductsStore((s) => s.items);
  const loading = useProductsStore((s) => s.loading);
  const error = useProductsStore((s) => s.error);

  // Ref estable a la acción del store. No la pongas en deps.
  const fetchProducts = useProductsStore.getState().fetch;

  useEffect(() => {
    fetchProducts(); // una sola vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!items.length) return <p>Sin resultados.</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>ID</th>
          <th style={{ textAlign: "left" }}>Título</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td>{i.id}</td>
            <td>{i.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
