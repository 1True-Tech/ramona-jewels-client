import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import { Order, OrderQueryParams, OrdersResponse, OrderStatsResponse, UpdateOrderStatusRequest } from '../apiTypes'



const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/orders',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery,
  tagTypes: ['Orders', 'Order', 'OrderStats'],
  endpoints: (builder) => ({
    // Get all orders with pagination and filtering
    getOrders: builder.query<OrdersResponse, OrderQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value))
          }
        })
        return `?${searchParams.toString()}`
      },
      providesTags: ['Orders'],
    }),
    
    // Get order statistics
    getOrderStats: builder.query<OrderStatsResponse, void>({
      query: () => 'stats',
      providesTags: ['OrderStats'],
    }),
    
    // Get single order
    getOrder: builder.query<{ success: boolean; data: Order }, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    
    // Update order status
    updateOrderStatus: builder.mutation<{ success: boolean }, UpdateOrderStatusRequest>({
      query: ({ id, ...body }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        'Orders',
        'OrderStats',
      ],
    }),
    
    // Cancel order
    cancelOrder: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        'Orders',
        'OrderStats',
      ],
    }),
    
    // Refund order
    refundOrder: builder.mutation<{ success: boolean }, { id: string; amount?: number; reason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/${id}/refund`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        'Orders',
        'OrderStats',
      ],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useRefundOrderMutation,
} = ordersApi