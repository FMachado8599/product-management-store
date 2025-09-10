"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { UiProduct } from "@/types/products";
import * as React from "react";

type SortOrder = "asc" | "desc";
type ColKey = keyof UiProduct;

type Col = {
  key: ColKey | "acciones";
  label: string;
  sortable?: boolean;
  className?: string;
};

const COLUMNS: Col[] = [
  { key: "producto", label: "Producto", sortable: true },
  { key: "link", label: "Link" },
  { key: "precio", label: "Precio" },
  { key: "prioridad", label: "Prioridad", sortable: true },
  { key: "asignado", label: "Asignado" },
  { key: "estado", label: "Estado", sortable: true },
  { key: "creador", label: "Creador" },
  { key: "fecha", label: "Fecha", sortable: true },
  { key: "acciones", label: "Acciones", className: "w-[1%]" },
];

type Props = {
  sortBy: ColKey;
  sortOrder: SortOrder;
  onSortChange: (key: ColKey) => void;
  sticky?: boolean; // para hacerlo sticky dentro del ScrollArea
};

export default function ProductsTableHeader({
  sortBy,
  sortOrder,
  onSortChange,
  sticky = true,
}: Props) {
  const iconFor = (key: Col["key"]) => {
    if (key === "acciones" || typeof key !== "string") return null;
    if (key !== sortBy)
      return <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" />
    );
  };

  return (
    <TableHeader>
      <TableRow
        className={
          sticky
            ? // sticky header dentro del ScrollArea
              "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75"
            : undefined
        }
      >
        {COLUMNS.map((col) => {
          const isSortable = Boolean(col.sortable);
          const isActive = col.key === sortBy;
          const base =
            "select-none whitespace-nowrap " +
            (isSortable ? "cursor-pointer " : "") +
            (isActive ? "text-foreground" : "text-muted-foreground");

          if (isSortable && col.key !== "acciones") {
            return (
              <TableHead
                key={col.key}
                className={base + (col.className ? ` ${col.className}` : "")}
                onClick={() => onSortChange(col.key as ColKey)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {iconFor(col.key)}
                </span>
              </TableHead>
            );
          }

          return (
            <TableHead
              key={col.key}
              className={base + (col.className ? ` ${col.className}` : "")}
              onClick={() => onSortChange("producto")}
            >
              {col.label}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}
