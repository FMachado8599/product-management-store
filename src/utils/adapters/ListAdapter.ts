import type { ApiItem, UiProduct } from "@/types/products";

export function apiListToUi(items: ApiItem[]): UiProduct[] {
  return (items ?? []).map((it) => {
    // asegurar número
    const priceNum =
      typeof it.price === "string" ? Number(it.price) : it.price ?? undefined;

    const assignedNames = it.asignados?.map((a) => a?.name).filter(Boolean) as
      | string[]
      | undefined;

    return {
      id: it.id,
      producto: it.name ?? "(sin nombre)",
      link: it.url ?? undefined,
      precio: Number.isFinite(priceNum as number)
        ? (priceNum as number)
        : undefined,
      prioridad: normalizePriority(it.prioridad),
      asignado: assignedNames?.length ? assignedNames.join(", ") : undefined,
      estado: normalizeEstado(it.estado),
      creador: it.requestedBy ?? undefined, // <— ahora existe en ApiItem
      fecha: it.lastEdited ?? undefined,
      origen:
        it.tipo === "Nuevo" || it.tipo === "Modificar" ? it.tipo : undefined,
    };
  });
}

function normalizePriority(p?: string | null): UiProduct["prioridad"] {
  if (!p) return undefined;
  const s = p.toLowerCase();
  if (s === "alta" || s === "media" || s === "baja") return s;
  return undefined;
}
function normalizeEstado(e?: string | null): UiProduct["estado"] {
  if (!e) return undefined;
  if (e === "Pendiente" || e === "En progreso" || e === "Terminado") return e;
  return undefined;
}
