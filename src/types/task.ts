export interface TaskModificar {
  productId: string;
  prioridad: "baja" | "media" | "alta" | "urgente";
  createdBy?: string; // backend puede inferir "Silvana" si así lo definieron
  assigneeId?: string;
  notes?: string;
}
