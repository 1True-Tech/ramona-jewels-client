"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AdminLayout } from "@/components/admin/admin-layout"
import { StatsCard } from "@/components/admin/stats-card"
import { SalesChart } from "@/components/admin/sales-chart"
import { ProductAnalytics } from "@/components/admin/product-analytics"
import { CategoryChart } from "@/components/admin/category-chart"
import { TopProducts } from "@/components/admin/top-products"
import { useAuth } from "@/contexts/redux-auth-context"
import { 
  useGetAnalyticsDashboardQuery,
  useGetRevenueMetricsQuery,
  useGetProductPerformanceQuery,
  useGetCustomerInsightsQuery
} from "@/store/api/analyticsApi"
import { Loader } from "@/components/ui/loader"
import { TrendingUp, Package, Users, ShoppingCart, DollarSign, Eye, Heart, Star } from "lucide-react"



export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [dateRange, setDateRange] = useState({ period: 'month' as const })

  // API queries with debugging
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetAnalyticsDashboardQuery(dateRange)
  const { data: revenueData, isLoading: revenueLoading, error: revenueError } = useGetRevenueMetricsQuery(dateRange)
  const { data: productData, isLoading: productLoading, error: productError } = useGetProductPerformanceQuery(dateRange)
  const { data: customerData, isLoading: customerLoading, error: customerError } = useGetCustomerInsightsQuery(dateRange)



  // Check for any errors
  const hasError = dashboardError || revenueError || productError || customerError
  
  // Extract error message properly
  const getErrorMessage = (error: any) => {
    if (!error) return null
    return error?.data?.message || error?.message || error?.error || 'Unknown error'
  }
  
  const errorMessage = getErrorMessage(dashboardError) || 
                      getErrorMessage(revenueError) || 
                      getErrorMessage(productError) || 
                      getErrorMessage(customerError) || 
                      'Failed to load analytics data'
  
  // Log errors for debugging
  useEffect(() => {
    if (hasError) {
      console.log('Analytics Errors:', {
        dashboard: dashboardError,
        revenue: revenueError,
        product: productError,
        customer: customerError
      })
    }
  }, [hasError, dashboardError, revenueError, productError, customerError])

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  if (dashboardLoading || revenueLoading || productLoading || customerLoading) {
    return (
      <AdminLayout>
        <Loader message="Loading analytics dashboard..." />
      </AdminLayout>
    )
  }

  // Handle API errors gracefully with fallback data

  // Fallback data when API fails
  const mockDashboard = {
    revenue: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      revenueGrowth: 0,
      averageOrderValue: 0,
      totalOrders: 0,
      conversionRate: 0
    },
    customers: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      averageOrderValue: 0,
      customerLifetimeValue: 0,
      topCustomers: []
    }
  }

  const revenue = revenueData?.data || (hasError ? mockDashboard.revenue : undefined)
  const products = productData?.data || []
  const customers = customerData?.data || (hasError ? mockDashboard.customers : undefined)
  const dashboard = dashboardData?.data || (hasError ? mockDashboard : undefined)

  const topProducts = products.slice(0, 4)

  const stats = [
    {
      title: "Total Revenue",
      value: `$${revenue?.totalRevenue?.toLocaleString() || '0'}`,
      change: revenue?.revenueGrowth !== undefined ? `${revenue.revenueGrowth >= 0 ? '+' : ''}${revenue.revenueGrowth.toFixed(1)}%` : '+0.0%',
      trend: (revenue?.revenueGrowth !== undefined && revenue.revenueGrowth >= 0 ? "up" : "down") as "up" | "down",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: revenue?.totalOrders?.toLocaleString() || '0',
      change: "+0.0%", // Static fallback since orderGrowth doesn't exist in RevenueMetrics
      trend: "up" as "up" | "down",
      icon: ShoppingCart,
    },
    {
      title: "Total Customers",
      value: customers?.totalCustomers?.toLocaleString() || '0',
      change: "+0.0%", // Static fallback since customerGrowth doesn't exist in CustomerInsights
      trend: "up" as "up" | "down",
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: `${revenue?.conversionRate?.toFixed(1) || '0'}%`,
      change: "+0.0%", // Static fallback since conversionGrowth doesn't exist in RevenueMetrics
      trend: "up" as "up" | "down",
      icon: TrendingUp,
    },
  ]

  const productStats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      change: "+0.0%", // Static fallback since productGrowth doesn't exist in AnalyticsDashboard
      icon: Package,
    },
    {
      title: "Product Views",
      value: "0", // Static fallback since totalViews doesn't exist in AnalyticsDashboard
      change: "+0.0%",
      icon: Eye,
    },
    {
      title: "Wishlist Adds",
      value: "0", // Static fallback since wishlistAdds doesn't exist in AnalyticsDashboard
      change: "+0.0%",
      icon: Heart,
    },
    {
      title: "Avg Rating",
      value: "0.0", // Static fallback since averageRating doesn't exist in AnalyticsDashboard
      change: "+0.0",
      icon: Star,
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {hasError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Limited Data Available
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Some analytics data couldn't be loaded. {errorMessage}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-yellow-100 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your perfume store performance and insights</p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold mb-4">Product Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <div className="bg-card rounded-lg border px-3 md:px-4 py-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <SalesChart />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <CategoryChart />
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <ProductAnalytics />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <TopProducts />
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
