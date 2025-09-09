export type Prioridad = "baja" | "media" | "alta";
export type Estado = "Pendiente" | "En progreso" | "Terminado";
export type Usuario = "Silvana" | "Facundo" | "Caroline" | "Nicolás";
export type Origen = "Nuevo" | "Modificar";
export type Categoria = "fitness" | "deportes" | "yoga";

export type Asignable = Exclude<Usuario, "Silvana">;

export interface Product {
  id: string;
  origen: Origen;
  producto: string;
  link?: string;
  precio?: number;
  prioridad?: Prioridad | null;
  asignado?: Asignable | null;
  estado: Estado;
  creador: Usuario;
  comentario?: string;
  fecha: string;
  imagen?: string;
  categoria?: Categoria;
}

export const USERS: Asignable[] = ["Facundo", "Caroline", "Nicolás"];
export const PRIORITIES: ReadonlyArray<Prioridad> = [
  "baja",
  "media",
  "alta",
] as const;
export const STATES: ReadonlyArray<Estado> = [
  "Pendiente",
  "En progreso",
  "Terminado",
] as const;
