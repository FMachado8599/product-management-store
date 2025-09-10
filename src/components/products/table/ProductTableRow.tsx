"use client";

import { ExternalLink, Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";

import { TableRow, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { isPriority, isState } from "@/utils/states";
import { formatDate, formatPrice } from "@/utils/format";
import { getPriorityColor, getStateColor } from "@/utils/styles";

import type { UiProduct } from "@/types/products";

type ProductRowProps = {
  product: UiProduct;
  users: string[];
  onInlineUpdate: (id: string, updates: Partial<UiProduct>) => void;
  onOpenDetail?: (p: UiProduct) => void;
  onDelete?: (p: UiProduct) => void;
  onReopen?: (p: UiProduct) => void;
};

export default function ProductRow({
  product,
  users,
  onInlineUpdate,
  onOpenDetail,
  onDelete,
  onReopen,
}: ProductRowProps) {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{product.producto}</div>
          {product.origen && (
            <Badge variant="outline" className="text-xs">
              {product.origen}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        {product.link && (
          <Button variant="ghost" size="icon" asChild>
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </TableCell>
      <TableCell>{formatPrice(product.precio)}</TableCell>
      <TableCell>
        <Select
          value={product.prioridad ?? undefined}
          onValueChange={(value: string) => {
            const nextPrio = isPriority(value) ? value : undefined;
            onInlineUpdate(product.id, { prioridad: nextPrio });
          }}
        >
          <SelectTrigger className="w-auto">
            <Badge className={getPriorityColor(product.prioridad)}>
              {product.prioridad ?? "—"}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baja">Baja</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={product.asignado || "unassigned"}
          onValueChange={(value: string) =>
            onInlineUpdate(product.id, {
              asignado: value === "unassigned" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Sin asignar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Sin asignar</SelectItem>
            {users.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={product.estado ?? undefined}
          onValueChange={(value: string) => {
            const nextState = isState(value) ? value : undefined;
            onInlineUpdate(product.id, { estado: nextState });
          }}
        >
          <SelectTrigger className="w-auto">
            <Badge className={getStateColor(product.estado)}>
              {product.estado ?? "—"}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En progreso">En progreso</SelectItem>
            <SelectItem value="Terminado">Terminado</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{product.creador ?? "—"}</TableCell>
      <TableCell>{formatDate(product.fecha ?? "—")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onOpenDetail?.(product)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalle
            </DropdownMenuItem>

            {product.estado !== "Terminado" && (
              <DropdownMenuItem onClick={() => onDelete?.(product)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            )}

            {product.estado === "Terminado" && (
              <DropdownMenuItem onClick={() => onReopen?.(product)}>
                <Edit className="mr-2 h-4 w-4" />
                Reabrir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
