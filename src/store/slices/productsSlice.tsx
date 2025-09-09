import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type {
  ApiItem,
  ProductsResponse,
  ProductsState,
} from "@/types/products";
import { listProducts } from "@/services/products.service";

const initialState: ProductsState = {
  items: [],
  status: "idle",
  page: 1,
  pageSize: 20,
  total: null,
  filters: { q: "" },
  cursor: null,
  nextCursor: null,
};

function dedupeAppend(base: ApiItem[], incoming: ApiItem[]) {
  const seen = new Set(base.map((p) => p.id));
  const merged = [...base];
  for (const it of incoming) if (!seen.has(it.id)) merged.push(it);
  return merged;
}

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  { append?: boolean } | void,
  { state: RootState; rejectValue: string }
>(
  "products/fetchProducts",
  async (arg, { getState, signal, rejectWithValue }) => {
    const { page, pageSize, filters, nextCursor } = getState().products;
    const append = Boolean((arg as { append?: boolean } | undefined)?.append);

    try {
      if (append) {
        if (!nextCursor) return rejectWithValue("No hay más páginas");
        return await listProducts(
          { cursor: nextCursor, pageSize, filters },
          signal
        );
      }
      return await listProducts(
        { page: page ?? 1, pageSize, filters, cursor: null },
        signal
      );
    } catch (err: any) {
      if (err?.name === "AbortError") throw err;
      return rejectWithValue(err?.message ?? "Error al listar productos");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.filters.q = action.payload;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
    },
    setCategory(state, action: PayloadAction<string | undefined>) {
      state.filters.category = action.payload;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
    },
    setInStock(state, action: PayloadAction<boolean | undefined>) {
      state.filters.inStock = action.payload;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
    },
    selectProduct(state, action: PayloadAction<string | undefined>) {
      state.selectedId = action.payload;
    },
    upsertOne(state, action: PayloadAction<ApiItem>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    removeOne(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (typeof state.total === "number") {
        state.total = Math.max(0, state.total - 1);
      }
    },
    inlineUpdate(
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<ApiItem> & { asignado?: string | undefined };
      }>
    ) {
      const { id, updates } = action.payload;
      const i = state.items.findIndex((p) => p.id === id);
      if (i < 0) return;

      const next: Partial<ApiItem> = { ...updates };

      if ("asignado" in updates) {
        const name = updates.asignado;
        (next as any).asignados = name ? [{ id: null, name }] : [];
        delete (next as any).asignado;
      }

      state.items[i] = { ...state.items[i], ...next };
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchProducts.rejected, (state, action) => {
        const msg =
          (action.payload as string) ||
          action.error.message ||
          "Error inesperado";
        if (msg === "No hay más páginas") {
          state.error = undefined;
          state.status = "succeeded";
          return;
        }
        state.status = "failed";
        state.error = msg;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const append = Boolean((action.meta.arg as any)?.append);
        state.status = "succeeded";

        if (append) {
          state.items = dedupeAppend(state.items, action.payload.items ?? []);
          state.total = action.payload.total ?? state.total;
          state.page = action.payload.page ?? state.page;
          state.pageSize = action.payload.pageSize ?? state.pageSize;
          state.cursor = action.payload.cursor ?? state.cursor;
          state.nextCursor = action.payload.nextCursor ?? null;
        } else {
          state.items = action.payload.items ?? [];
          state.total = action.payload.total ?? null;
          state.page = action.payload.page ?? 1;
          state.pageSize = action.payload.pageSize ?? state.pageSize;
          state.cursor = action.payload.cursor ?? null;
          state.nextCursor = action.payload.nextCursor ?? null;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Error inesperado";
      });
  },
});

export const {
  setQuery,
  setCategory,
  setInStock,
  setPage,
  setPageSize,
  selectProduct,
  upsertOne,
  removeOne,
  inlineUpdate,
} = productsSlice.actions;

export default productsSlice.reducer;

export const selectProductsState = (s: RootState) => s.products;
export const selectItems = (s: RootState) => s.products.items;
export const selectStatus = (s: RootState) => s.products.status;
export const selectError = (s: RootState) => s.products.error;
export const selectNextCursor = (s: RootState) => s.products.nextCursor;
export const selectHasMore = (s: RootState) => Boolean(s.products.nextCursor);
export const selectPagination = createSelector(
  [
    (s: RootState) => s.products.page,
    (s: RootState) => s.products.pageSize,
    (s: RootState) => s.products.total,
  ],
  (page, pageSize, total) => ({ page, pageSize, total })
);
export const selectFilters = (s: RootState) => s.products.filters;
export const selectSelectedProduct = (s: RootState) =>
  s.products.items.find((p) => p.id === s.products.selectedId);
