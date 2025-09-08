import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type {
  ApiItem,
  Filters,
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

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  "products/fetchProducts",
  async (_void, { getState, signal, rejectWithValue }) => {
    const { page, pageSize, filters } = getState().products;
    try {
      return await listProducts({ page, pageSize, filters }, signal);
    } catch (err: any) {
      if (err?.name === "AbortError") throw err; // respetar abort
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
    },
    setCategory(state, action: PayloadAction<string | undefined>) {
      state.filters.category = action.payload;
      state.page = 1;
    },
    setInStock(state, action: PayloadAction<boolean | undefined>) {
      state.filters.inStock = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
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
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.cursor = action.payload.cursor;
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Error inesperado";
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
} = productsSlice.actions;

export default productsSlice.reducer;

export const selectProductsState = (s: RootState) => s.products;
export const selectProducts = (s: RootState) => s.products.items;
export const selectStatus = (s: RootState) => s.products.status;
export const selectError = (s: RootState) => s.products.error;

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
