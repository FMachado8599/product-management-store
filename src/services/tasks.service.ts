import { apiClient } from "@/services/apiClient";
import type { TaskModificar } from "@/types/task";

export function createTaskModificar(body: TaskModificar) {
  // ¡No hagas JSON.stringify acá! apiClient ya serializa el body.
  return apiClient.post<{ id: string; ok: true }>("/tasks/modificar", body);
}
