import type { Estado, Prioridad } from "@/lib/interfaces";

export function isPriority(v: string): v is Prioridad {
  return v === "baja" || v === "media" || v === "alta";
}
export function isState(v: string): v is Estado {
  return v === "Pendiente" || v === "En Progreso" || v === "Terminado";
}
