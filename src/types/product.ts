export enum Estado {
  Pendiente = "pendiente",
  EnProgreso = "en_progreso",
  Hecho = "hecho",
}
export enum Prioridad {
  Baja = "baja",
  Media = "media",
  Alta = "alta",
  Urgente = "urgente",
}

export interface Product {
  id: string;
  title: string;
  sku?: string;
  brand?: string;
  price?: number;
  estado?: Estado;
  prioridad?: Prioridad;
  imageUrl?: string;
}
