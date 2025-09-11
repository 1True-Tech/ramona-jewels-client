import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import { Order, OrderQueryParams, OrdersResponse, OrderStatsResponse, UpdateOrderStatusRequest } from '../apiTypes'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/orders/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Wrap baseQuery to handle backend response messages via global modal
const baseQueryWithModal: typeof baseQuery = async (args: any, api: any, extra: any) => {
  const result: any = await baseQuery(args, api, extra)
  // If backend returns success:false or error structure, surface it via modal
  if (result?.error) {
    const err = result.error as any
    const message = err?.data?.message || err?.data?.error || 'Request failed'
    const errors = err?.data?.errors
    const { showModal } = await import('../slices/uiSlice')
    api.dispatch(showModal({ type: 'error', title: 'Request Error', message, errors }))
  } else if (result?.data && result.data.success === true && (args as any)?.method && (args as any)?.method !== 'GET') {
    // For non-GET successful mutations, show success modal with optional message
    const { showModal } = await import('../slices/uiSlice')
    const message = (result.data as any).message || 'Operation completed successfully'
    api.dispatch(showModal({ type: 'success', title: 'Success', message }))
  }
  return result
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithModal,
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

    // Get my orders with pagination and filtering
    getMyOrders: builder.query<OrdersResponse, OrderQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value))
          }
        })
        return `my-orders?${searchParams.toString()}`
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
    
    // Create Stripe PaymentIntent
    createStripePaymentIntent: builder.mutation<{ success: boolean; data: { clientSecret: string; orderId: string; readableOrderId: string; amount: number } }, any>({
      query: (body) => ({
        url: `/stripe/create-payment-intent`,
        method: 'POST',
        body,
      }),
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
  useGetMyOrdersQuery,
  useGetOrderStatsQuery,
  useGetOrderQuery,
  useCreateStripePaymentIntentMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useRefundOrderMutation,
} = ordersApi