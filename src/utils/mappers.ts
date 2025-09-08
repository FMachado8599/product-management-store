// utils/mappers.ts
import type { ApiItem, UiProduct } from "@/types/products";

export function formatDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-UY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function apiToUi(p: ApiItem): UiProduct {
  const firstAssignee = p.asignados?.[0]?.name ?? "";

  const prio = (p.prioridad ?? "").toLowerCase();
  const estado = p.estado ?? "";

  return {
    id: p.id,
    producto: p.name ?? "Sin nombre",
    link: p.url ?? undefined,
    precio: p.price ?? undefined,
    prioridad:
      prio === "baja" || prio === "media" || prio === "alta"
        ? (prio as UiProduct["prioridad"])
        : undefined,
    asignado: firstAssignee || undefined,
    estado:
      estado === "Pendiente" ||
      estado === "En progreso" ||
      estado === "Terminado"
        ? (estado as UiProduct["estado"])
        : undefined,
    creador: firstAssignee || undefined, // placeholder hasta tener "Created by"
    fecha: formatDate(p.lastEdited),
    origen: p.tipo === "Nuevo" || p.tipo === "Modificar" ? p.tipo : undefined,
  };
}

export function apiListToUi(items: ApiItem[]): UiProduct[] {
  return items.map(apiToUi);
}
