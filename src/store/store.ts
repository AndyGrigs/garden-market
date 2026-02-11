import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { authApi } from './api/authApi';
import { treesApi } from './api/treesApi';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import treeReducer from './slices/treeSlice';
import cartReducer from '@/features/buyer/api/cartSlice';
import { categoryApi } from './api/categoryApi';
import { uploadApi } from './api/uploadApi';
import { reviewApi } from '@/features/buyer/api/reviewApi';
import { orderApi } from '@/features/buyer/api/orderApi';
import { sellerApi } from '@/features/seller/api/sellerApi';
import { adminApi } from './api/adminApi';
import { paymentApi } from '@/features/buyer/api/paymentsApi';
import { contactApi } from './api/contactApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    tree: treeReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [treesApi.reducerPath]: treesApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  // Disable DevTools in production for better performance
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore serializability checks for actions with file uploads
        ignoredActions: [
          'uploadApi/executeMutation/fulfilled',
          'uploadApi/executeMutation/pending',
        ],
        // Ignore these paths in the state for performance
        ignoredPaths: ['uploadApi.mutations'],
      },
      // Enable immutability check only in development
      immutableCheck: process.env.NODE_ENV === 'development',
    })
      .concat(authApi.middleware)
      .concat(treesApi.middleware)
      .concat(categoryApi.middleware)
      .concat(uploadApi.middleware)
      .concat(reviewApi.middleware)
      .concat(orderApi.middleware)
      .concat(sellerApi.middleware)
      .concat(adminApi.middleware)
      .concat(paymentApi.middleware)
      .concat(contactApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;