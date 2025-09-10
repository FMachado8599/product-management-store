"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PaginationTableProps = {
  totalItems: number;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  /** Si no viene, se calcula con totalItems */
  totalPages?: number;
  perPageOptions?: number[];
  className?: string;
};

export default function PaginationTable({
  totalItems,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  perPageOptions = [10, 25, 50],
  className,
}: PaginationTableProps) {
  const pages =
    totalPages && totalPages > 0
      ? totalPages
      : Math.max(1, Math.ceil(totalItems / Math.max(1, itemsPerPage)));

  const canPrev = currentPage > 1;
  const canNext = currentPage < pages;

  return (
    <div className="flex items-center justify-between space-x-2 pt-4">
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
            disabled={!canNext}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
