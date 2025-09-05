import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  color?: string
  size?: string
  image: string
}

interface ShippingAddress {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface OrdersResponse {
  success: boolean
  data: Order[]
  total: number
  page: number
  pages: number
}

interface OrderStats {
  total: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  totalRevenue: number
  averageOrderValue: number
}

interface OrderStatsResponse {
  success: boolean
  data: OrderStats
}

interface OrderQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

interface UpdateOrderStatusRequest {
  id: string
  status: string
  trackingNumber?: string
  notes?: string
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/admin',
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
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `orders?${searchParams.toString()}`
      },
      providesTags: ['Orders'],
    }),
    
    // Get order statistics
    getOrderStats: builder.query<OrderStatsResponse, void>({
      query: () => 'orders/stats',
      providesTags: ['OrderStats'],
    }),
    
    // Get single order
    getOrder: builder.query<{ success: boolean; data: Order }, string>({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    
    // Update order status
    updateOrderStatus: builder.mutation<{ success: boolean }, UpdateOrderStatusRequest>({
      query: ({ id, ...body }) => ({
        url: `orders/${id}/status`,
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
        url: `orders/${id}/cancel`,
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
        url: `orders/${id}/refund`,
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