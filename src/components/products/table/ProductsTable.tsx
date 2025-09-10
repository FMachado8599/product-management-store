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
import { USERS } from "@/lib/interfaces";
type AssignOption = (typeof USERS)[number] | "unassigned";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea } from "@/components/ui/scroll-area";
import PaginationTable from "@/components/products/table/PaginationTable";
import ProductRow from "@/components/products/table/ProductTableRow";
import ProductsTableHeader from "@/components/products/table/ProductsTableHeader";
import { UiProduct } from "@/types/products";

type Props = {
  onOpenDetail?: (p: UiProduct) => void;
  onDeleteRequest?: (p: UiProduct) => void;
  onReopenRequest?: (p: UiProduct) => void;
  onInlineUpdate?: (id: string, updates: Partial<UiProduct>) => void;
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

  useEffect(() => {
    dispatch(fetchFirstPage());
  }, [dispatch]);

  const products: UiProduct[] = useMemo(
    () => apiListToUi(apiItems),
    [apiItems]
  );

  const [sortBy, setSortBy] = useState<keyof UiProduct>("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products;
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    arr.sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];

      if (sortBy === "fecha") {
        av = av ? new Date(av as string).getTime() : 0;
        bv = bv ? new Date(bv as string).getTime() : 0;
      }

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

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const paginatedProducts = useMemo(
    () =>
      sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedProducts, currentPage, itemsPerPage]
  );

  const handleInlineUpdate = (id: string, u: Partial<UiProduct>) => {
    onInlineUpdate?.(id, u);
  };
  const handleOpenDetail = (p: UiProduct) => onOpenDetail?.(p);
  const handleDelete = (p: UiProduct) => onDeleteRequest?.(p);
  const handleReopen = (p: UiProduct) => onReopenRequest?.(p);
  const handleSortChange = (field: keyof UiProduct) => {
    setSortBy(field);
    setSortOrder(sortBy === field && sortOrder === "asc" ? "desc" : "asc");
  };

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
            <ProductsTableHeader
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              sticky
            />

            <TableBody>
              {paginatedProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  users={USERS}
                  onInlineUpdate={handleInlineUpdate}
                  onOpenDetail={handleOpenDetail}
                  onDelete={handleDelete}
                  onReopen={handleReopen}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <PaginationTable
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
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
