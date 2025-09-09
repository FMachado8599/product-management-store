export function formatPrice(p?: number | null) {
  if (p == null) return "—";
  try {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
    }).format(p);
  } catch {
    return String(p);
  }
}
export function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("es-UY", { dateStyle: "short", timeStyle: "short" });
}
export function fmtStock(v?: boolean | null) {
  if (v === true) return "En stock";
  if (v === false) return "Sin stock";
  return "—";
}
