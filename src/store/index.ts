import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  // middleware: (getDefault) => getDefault().concat(...opcionales)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
