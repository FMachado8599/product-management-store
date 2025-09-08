import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

const base = (s: RootState) => s.products;

export const selectItems = createSelector(base, (s) => s.items);
export const selectStatus = createSelector(base, (s) => s.status);
export const selectError = createSelector(base, (s) => s.error);
export const selectNextCursor = createSelector(base, (s) => s.nextCursor);
export const selectFilters = createSelector(base, (s) => s.filters);

export const selectPagination = createSelector(base, (s) => ({
  page: s.page,
  pageSize: s.pageSize,
  total: s.total,
}));
