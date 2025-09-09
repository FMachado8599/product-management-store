export interface ApiItem {
  id: string;
  name: string | null;
  sku?: string | null;
  price?: number | null;
  url?: string | null;
  imageUrl?: string | null;
  tipo?: "Nuevo" | "Modificar" | null;
  inStock?: boolean | null;
  prioridad?: "baja" | "media" | "alta" | null;
  estado?: "Pendiente" | "En progreso" | "Terminado" | null;
  asignados?: {
    id: string | null;
    name: string | null;
    avatar?: string | null;
  }[];
  lastEdited?: string | null;
  requestedBy?: string | null;
}

export interface UiProduct {
  id: string;
  producto: string;
  link?: string;
  precio?: number;
  prioridad?: "baja" | "media" | "alta";
  asignado?: string;
  estado?: "Pendiente" | "En progreso" | "Terminado";
  creador?: string;
  fecha?: string;
  origen?: "Nuevo" | "Modificar";
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  url: string;
  imageUrl?: string;
}

export interface Filters {
  q?: string;
  category?: string;
  inStock?: boolean;
}

export type ListProductsParams = {
  page?: number | null;
  pageSize: number;
  cursor?: string | null;
  filters: {
    q?: string;
    category?: string;
    inStock?: boolean | null;
  };
};

export type ProductsResponse = {
  items: ApiItem[];
  total: number | null;
  page: number | null;
  pageSize: number;
  cursor: string | null;
  nextCursor: string | null;
};

export interface ProductsState {
  items: ApiItem[];
  total: number | null;
  page: number | null;
  pageSize: number;
  filters: Filters;
  selectedId?: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  cursor: string | null;
  nextCursor: string | null;
}
