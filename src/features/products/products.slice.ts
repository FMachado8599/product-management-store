import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ProductsState, Filters } from "@/types/products";
import { fetchFirstPage, fetchNextPage } from "./products.thunks";

const initialState: ProductsState = {
  items: [],
  total: null,
  page: 1,
  pageSize: 20,
  filters: { q: "", category: undefined, inStock: undefined },
  selectedId: undefined,
  status: "idle",
  error: undefined,
  cursor: null,
  nextCursor: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.filters.q = action.payload;
      // reset duro
      state.items = [];
      state.total = null;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
      state.status = "idle";
    },
    setCategory(state, action: PayloadAction<Filters["category"]>) {
      state.filters.category = action.payload;
      state.items = [];
      state.total = null;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
      state.status = "idle";
    },
    setInStock(state, action: PayloadAction<Filters["inStock"]>) {
      state.filters.inStock = action.payload ?? undefined;
      state.items = [];
      state.total = null;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
      state.status = "idle";
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = Math.max(1, action.payload | 0);
      state.items = [];
      state.total = null;
      state.page = 1;
      state.cursor = null;
      state.nextCursor = null;
      state.status = "idle";
    },
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // Primera página
    builder.addCase(fetchFirstPage.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(fetchFirstPage.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.items = payload.items ?? [];
      state.total = payload.total ?? null;
      state.page = payload.page ?? 1; // compat
      state.pageSize = payload.pageSize ?? state.pageSize;
      state.cursor = payload.cursor ?? null; // suele ser null en first
      state.nextCursor = payload.nextCursor ?? null;
    });
    builder.addCase(fetchFirstPage.rejected, (state, { payload, error }) => {
      state.status = "failed";
      state.error =
        (payload as string) || error.message || "Error cargando productos";
    });

    // Siguiente página (cursor)
    builder.addCase(fetchNextPage.pending, (state) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(fetchNextPage.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.items.push(...(payload.items ?? []));
      state.total = payload.total ?? state.total; // normalmente queda null
      state.cursor = payload.cursor ?? state.cursor; // cursor usado
      state.nextCursor = payload.nextCursor ?? null;
      // page: lo dejamos igual; cuando hay cursor, no importa
    });
    builder.addCase(fetchNextPage.rejected, (state, { payload, error }) => {
      state.status = "failed";
      state.error =
        (payload as string) || error.message || "Error cargando más productos";
    });
  },
});

export const { setQuery, setCategory, setInStock, setPageSize, clearError } =
  productsSlice.actions;

export const productsReducer = productsSlice.reducer;
