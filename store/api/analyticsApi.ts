import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

interface SalesData {
  date: string
  sales: number
  orders: number
  revenue: number
}

interface ProductPerformance {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  views: number
  conversionRate: number
  image: string
}

interface CategoryPerformance {
  id: string
  name: string
  sales: number
  revenue: number
  products: number
  averagePrice: number
}

interface CustomerInsights {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  averageOrderValue: number
  customerLifetimeValue: number
  topCustomers: {
    id: string
    name: string
    email: string
    totalSpent: number
    orders: number
  }[]
}

interface RevenueMetrics {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  revenueGrowth: number
  averageOrderValue: number
  totalOrders: number
  conversionRate: number
}

interface InventoryInsights {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  topSellingProducts: ProductPerformance[]
  slowMovingProducts: ProductPerformance[]
}

interface TrafficData {
  date: string
  visitors: number
  pageViews: number
  bounceRate: number
  sessionDuration: number
}

interface AnalyticsDashboard {
  revenue: RevenueMetrics
  sales: SalesData[]
  customers: CustomerInsights
  products: ProductPerformance[]
  categories: CategoryPerformance[]
  inventory: InventoryInsights
  traffic: TrafficData[]
}

interface AnalyticsResponse {
  success: boolean
  data: AnalyticsDashboard
}

interface DateRangeParams {
  startDate?: string
  endDate?: string
  period?: 'day' | 'week' | 'month' | 'year'
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

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery,
  tagTypes: ['Analytics', 'SalesData', 'ProductPerformance', 'CustomerInsights'],
  endpoints: (builder) => ({
    // Get complete analytics dashboard
    getAnalyticsDashboard: builder.query<AnalyticsResponse, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `analytics?${searchParams.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    
    // Get sales data
    getSalesData: builder.query<{ success: boolean; data: SalesData[] }, DateRangeParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
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
        Object.entries(params).forEach(([key, value]) => {
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
        Object.entries(params).forEach(([key, value]) => {
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
        Object.entries(params).forEach(([key, value]) => {
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
        Object.entries(params).forEach(([key, value]) => {
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
        Object.entries(params).forEach(([key, value]) => {
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
        Object.entries(params).forEach(([key, value]) => {
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