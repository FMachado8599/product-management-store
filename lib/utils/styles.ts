// src/lib/utils/styles.ts
import type { Estado, Prioridad } from "@/lib/interfaces";

export const getPriorityColor = (p: Prioridad) => {
  switch (p) {
    case "alta":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "media":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "baja":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export const getStateColor = (s: Estado) => {
  switch (s) {
    case "Terminado":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "En progreso":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Pendiente":
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};
