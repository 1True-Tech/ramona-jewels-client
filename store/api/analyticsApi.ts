import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

export interface SalesData {
  date: string
  revenue: number
  orders: number
  averageOrderValue: number
}

export interface ProductPerformance {
  id: string
  name: string
  category: string
  // Backend fields
  totalSold: number
  totalRevenue: number
  averagePrice: number
  currentStock: number
  image: string | null
  // Optional legacy fields for compatibility (not returned by backend)
  sales?: number
  revenue?: number
  views?: number
  conversionRate?: number
}

export interface CategoryPerformance {
  category: string
  totalSold: number
  totalRevenue: number
  productCount: number
}

export interface CustomerInsights {
  totalCustomers: number
  newCustomers: number
  // Detailed insights from backend
  averageLifetimeValue: number
  averageOrdersPerCustomer: number
  repeatCustomerRate: number
  customerSegments: {
    high: number
    medium: number
    low: number
  }
  // Optional legacy fields for compatibility
  returningCustomers?: number
  averageOrderValue?: number
  customerLifetimeValue?: number
  topCustomers?: {
    id: string
    name: string
    email: string
    totalSpent: number
    orders: number
  }[]
}

// Summary metrics used on dashboard
export interface RevenueMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  // Optional fields that may be present on dashboard only
  revenueGrowth?: number
  conversionRate?: number
  monthlyRevenue?: number | { month: string; revenue: number }[]
  yearlyRevenue?: number
  revenueByPaymentMethod?: { _id: string; revenue: number; orders: number }[]
  totalShipping?: number
  totalTax?: number
  totalDiscount?: number
  // Added: payment status breakdown and trends
  totalPaidRevenue?: number
  totalPaidCount?: number
  pendingCount?: number
  failedCount?: number
  refundedCount?: number
  paidRevenueGrowth?: number
  paymentStatusBreakdown?: { status: 'paid' | 'pending' | 'failed' | 'refunded'; amount: number; count: number }[]
  statusTrends?: { paid: number; pending: number; failed: number; refunded: number }
}

export interface InventoryInsights {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  topSellingProducts: ProductPerformance[]
  slowMovingProducts: ProductPerformance[]
}

export interface TrafficData {
  date: string
  visitors: number
  pageViews: number
  bounceRate: number
  sessionDuration: number
}

export interface AnalyticsDashboard {
  revenue: RevenueMetrics
  sales: SalesData[]
  customers: CustomerInsights
  products: ProductPerformance[]
  categories: CategoryPerformance[]
  inventory: InventoryInsights
  traffic: TrafficData[]
}

export interface AnalyticsResponse {
  success: boolean
  data: AnalyticsDashboard
}

export interface DateRangeParams {
  startDate?: string
  endDate?: string
  period?: 'day' | 'week' | 'month' | 'year' | 'daily' | 'weekly' | 'monthly' | 'hourly'
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/admin/',
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

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: baseQueryWithModal,
  tagTypes: ['Analytics', 'SalesData', 'ProductPerformance', 'CustomerInsights'],
  endpoints: (builder) => ({
    // Get complete analytics dashboard
    getAnalyticsDashboard: builder.query<AnalyticsResponse, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/dashboard?${searchParams.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    
    // Get sales data
    getSalesData: builder.query<{ success: boolean; data: SalesData[] }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/sales?${searchParams.toString()}`
      },
      providesTags: ['SalesData'],
    }),
    
    // Get revenue metrics
    getRevenueMetrics: builder.query<{ success: boolean; data: RevenueMetrics }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/revenue?${searchParams.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    
    // Get product performance
    getProductPerformance: builder.query<{ success: boolean; data: ProductPerformance[] }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/products?${searchParams.toString()}`
      },
      providesTags: ['ProductPerformance'],
    }),
    
    // Get category performance
    getCategoryPerformance: builder.query<{ success: boolean; data: CategoryPerformance[] }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/categories?${searchParams.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    
    // Get customer insights
    getCustomerInsights: builder.query<{ success: boolean; data: CustomerInsights }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/customers?${searchParams.toString()}`
      },
      providesTags: ['CustomerInsights'],
    }),
    
    // Get inventory insights
    getInventoryInsights: builder.query<{ success: boolean; data: InventoryInsights }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/inventory?${searchParams.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    
    // Get traffic data
    getTrafficData: builder.query<{ success: boolean; data: TrafficData[] }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics/traffic?${searchParams.toString()}`
      },
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useGetAnalyticsDashboardQuery,
  useGetSalesDataQuery,
  useGetRevenueMetricsQuery,
  useGetProductPerformanceQuery,
  useGetCategoryPerformanceQuery,
  useGetCustomerInsightsQuery,
  useGetInventoryInsightsQuery,
  useGetTrafficDataQuery,
} = analyticsApi