// src/components/products/filters/FiltersBar.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectFilters } from "@/features/products/products.selectors";
import {
  setQuery,
  setCategory,
  setInStock,
} from "@/features/products/products.slice"; // ajusta path si difiere
import { fetchFirstPage } from "@/features/products/products.thunks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["indumentaria", "calzado", "accesorios"];

export default function FiltersBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  const apply = () => dispatch(fetchFirstPage());

  const handleQuery = (q: string) => {
    dispatch(setQuery(q));
    apply();
  };

  const handleCategory = (cat: string) => {
    dispatch(setCategory(cat === "all" ? undefined : cat));
    apply();
  };

  const handleInStock = (val: string) => {
    const parsed =
      val === "all"
        ? undefined
        : val === "true"
        ? true
        : val === "false"
        ? false
        : undefined;

    dispatch(setInStock(parsed));
    apply();
  };

  const clearAll = () => {
    dispatch(setQuery(""));
    dispatch(setCategory(undefined));
    dispatch(setInStock(undefined));
    apply();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar…"
          value={filters.q}
          onChange={(e) => handleQuery(e.target.value)}
        />

        <div className="flex gap-2 flex-col sm:flex-row flex-1">
          <Select
            value={filters.category ?? "all"}
            onValueChange={handleCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={
              filters.inStock === undefined
                ? "all"
                : filters.inStock
                ? "true"
                : "false"
            }
            onValueChange={handleInStock}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">En stock</SelectItem>
              <SelectItem value="false">Sin stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(filters.q ||
          filters.category !== undefined ||
          filters.inStock !== undefined) && (
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={clearAll}
          >
            Limpiar filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
