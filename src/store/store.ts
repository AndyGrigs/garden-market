import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { treesApi } from './api/treesApi';
import authReducer from './slices/authSlice';
import { categoryApi } from './api/categoryApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [treesApi.reducerPath]: treesApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(treesApi.middleware)
      .concat(categoryApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;