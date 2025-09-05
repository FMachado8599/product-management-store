import { http } from "@/services/apiClient";
import type { TaskModificar } from "@/types/task";

export function createTaskModificar(body: TaskModificar) {
  return http<{ id: string; ok: true }>(`/tasks/modificar`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
