import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { listProducts } from "@/services/products.service";
import type { ProductsResponse } from "@/types/products";

// Primera página (sin cursor)
export const fetchFirstPage = createAsyncThunk<
  ProductsResponse,
  void,
  { state: RootState }
>("products/fetchFirstPage", async (_arg, { getState }) => {
  const { products } = getState();
  const res = await listProducts(
    {
      page: 1,
      pageSize: products.pageSize,
      cursor: null,
      filters: products.filters,
    },
    undefined
  );
  return res;
});

// Siguiente página (con cursor)
export const fetchNextPage = createAsyncThunk<
  ProductsResponse,
  void,
  { state: RootState }
>("products/fetchNextPage", async (_arg, { getState, rejectWithValue }) => {
  const { products } = getState();
  if (!products.nextCursor) {
    return rejectWithValue("No hay más resultados");
  }
  const res = await listProducts(
    {
      pageSize: products.pageSize,
      cursor: products.nextCursor, // <- magia
      filters: products.filters,
    },
    undefined
  );
  return res;
});
