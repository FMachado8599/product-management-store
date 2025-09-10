import { USERS } from "@/lib/interfaces";
type AssignOption = (typeof USERS)[number] | "unassigned";

export type FormState = {
  nombre: string;
  link: string;
  precio: string;
  prioridad: "baja" | "media" | "alta";
  asignado: AssignOption;
};

export type CreateNewPayload = {
  producto: string;
  link?: string;
  precio: number;
  prioridad?: "baja" | "media" | "alta";
  asignado?: string;
  origen: "Nuevo";
};
