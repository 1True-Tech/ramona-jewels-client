import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { authApi } from './api/authApi'
import { usersApi } from './api/usersApi'
import { categoriesApi } from './api/categoriesApi'
import { productsApi } from './api/productsApi'
import { adminApi } from './api/adminApi'
import { ordersApi } from './api/ordersApi'
import { analyticsApi } from './api/analyticsApi'
import { productTypesApi } from './api/productTypesApi'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [productTypesApi.reducerPath]: productTypesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      usersApi.middleware,
      categoriesApi.middleware,
      productsApi.middleware,
      adminApi.middleware,
      ordersApi.middleware,
      analyticsApi.middleware,
      productTypesApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch