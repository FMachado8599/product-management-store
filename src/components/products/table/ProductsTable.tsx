// src/features/products/ProductsTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";

import {
  fetchFirstPage,
  fetchNextPage,
} from "@/features/products/products.thunks";
import {
  selectItems,
  selectNextCursor,
  selectStatus,
} from "@/features/products/products.selectors";

import { apiListToUi } from "@/utils/adapters/ListAdapter";
import { getPriorityColor, getStateColor } from "@/utils/styles";
import { USERS } from "@/lib/interfaces";
type AssignOption = (typeof USERS)[number] | "unassigned";

import { ExternalLink, Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { isPriority, isState } from "@/utils/states";
import { formatDate, formatPrice } from "@/utils/format";

type UiProduct = {
  id: string;
  producto: string;
  link?: string;
  precio?: number;
  prioridad?: "baja" | "media" | "alta";
  asignado?: string;
  estado?: "Pendiente" | "En progreso" | "Terminado";
  creador?: string;
  fecha?: string; // ISO
  origen?: "Nuevo" | "Modificar";
};

type Props = {
  onOpenDetail?: (p: UiProduct) => void; // antes: setSelectedProduct(product)
  onDeleteRequest?: (p: UiProduct) => void; // antes: setDeleteProduct(product)
  onReopenRequest?: (p: UiProduct) => void; // reabrir
  onInlineUpdate?: (id: string, updates: Partial<UiProduct>) => void; // antes: updateProduct(...)
};

export default function ProductsTable({
  onOpenDetail,
  onDeleteRequest,
  onReopenRequest,
  onInlineUpdate,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const apiItems = useSelector(selectItems);
  const nextCursor = useSelector(selectNextCursor);
  const status = useSelector(selectStatus);

  // 1) Traer primera página del backend
  useEffect(() => {
    dispatch(fetchFirstPage());
  }, [dispatch]);

  // 2) Adaptar ApiItem[] -> UiProduct[]
  const products: UiProduct[] = useMemo(
    () => apiListToUi(apiItems),
    [apiItems]
  );

  // 3) Estados locales mínimos para ordenar/paginar (si querés luego lo movemos afuera)
  const [sortBy, setSortBy] = useState<keyof UiProduct>("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 4) Ordenar + paginar local
  const filteredProducts = products; // si luego querés filtros locales, aplicalos acá
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    arr.sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];

      // fecha ISO → timestamp
      if (sortBy === "fecha") {
        av = av ? new Date(av as string).getTime() : 0;
        bv = bv ? new Date(bv as string).getTime() : 0;
      }

      // prioridad textual → orden numérico
      if (sortBy === "prioridad") {
        const order = { baja: 1, media: 2, alta: 3 } as const;
        av = av ? order[av as keyof typeof order] : 0;
        bv = bv ? order[bv as keyof typeof order] : 0;
      }

      if (av! < bv!) return sortOrder === "asc" ? -1 : 1;
      if (av! > bv!) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredProducts, sortBy, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage)
  );
  const paginatedProducts = useMemo(
    () =>
      sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedProducts, currentPage, itemsPerPage]
  );

  // 5) Helpers locales chicos (podés mover a utils si preferís)
  const formatPrice = (p?: number) =>
    p == null
      ? "—"
      : new Intl.NumberFormat("es-UY", {
          style: "currency",
          currency: "UYU",
        }).format(p);

  // 6) No-ops seguros si no llegan callbacks del padre
  const handleInlineUpdate = (id: string, u: Partial<UiProduct>) => {
    onInlineUpdate?.(id, u);
  };
  const handleOpenDetail = (p: UiProduct) => onOpenDetail?.(p);
  const handleDelete = (p: UiProduct) => onDeleteRequest?.(p);
  const handleReopen = (p: UiProduct) => onReopenRequest?.(p);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos ({filteredProducts.length})</CardTitle>
      </CardHeader>

      <CardContent>
        {status === "loading" && (
          <div className="py-6 text-sm text-muted-foreground">Cargando…</div>
        )}

        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortBy("producto");
                    setSortOrder(
                      sortBy === "producto" && sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                >
                  Producto
                </TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortBy("prioridad");
                    setSortOrder(
                      sortBy === "prioridad" && sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                >
                  Prioridad
                </TableHead>
                <TableHead>Asignado</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortBy("estado");
                    setSortOrder(
                      sortBy === "estado" && sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                >
                  Estado
                </TableHead>
                <TableHead>Creador</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortBy("fecha");
                    setSortOrder(
                      sortBy === "fecha" && sortOrder === "asc" ? "desc" : "asc"
                    );
                  }}
                >
                  Fecha
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProducts.map((product) => (
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
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                        handleInlineUpdate(product.id, { prioridad: nextPrio });
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
                      onValueChange={(value: AssignOption) =>
                        handleInlineUpdate(product.id, {
                          asignado:
                            value === "unassigned"
                              ? undefined
                              : (value as string),
                        })
                      }
                    >
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Sin asignar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Sin asignar</SelectItem>
                        {USERS.map((user) => (
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
                        const nextPrio = isState(value) ? value : undefined;
                        handleInlineUpdate(product.id, { estado: nextPrio });
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
                        <DropdownMenuItem
                          onClick={() => handleOpenDetail(product)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalle
                        </DropdownMenuItem>

                        {product.estado !== "Terminado" && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        )}

                        {product.estado === "Terminado" && (
                          <DropdownMenuItem
                            onClick={() => handleReopen(product)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Reabrir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination (local) */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>

        {/* Alternativa a la paginación local: paginar por cursor desde backend */}
        {/* {nextCursor && (
          <div className="pt-2">
            <Button onClick={() => dispatch(fetchNextPage())}>Cargar más</Button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
