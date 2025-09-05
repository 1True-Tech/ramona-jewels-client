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

  // API queries
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetAnalyticsDashboardQuery(dateRange)
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueMetricsQuery(dateRange)
  const { data: productData, isLoading: productLoading } = useGetProductPerformanceQuery(dateRange)
  const { data: customerData, isLoading: customerLoading } = useGetCustomerInsightsQuery(dateRange)

  useEffect(() => {
    if (!user || user.role !== "admin") {
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

  if (dashboardError) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">
          Error loading analytics data. Please try again.
        </div>
      </AdminLayout>
    )
  }

  const revenue = revenueData?.data
  const products = productData?.data || []
  const customers = customerData?.data
  const dashboard = dashboardData?.data

  const stats = [
    {
      title: "Total Revenue",
      value: `$${revenue?.totalRevenue?.toLocaleString() || '0'}`,
      change: `+${revenue?.revenueGrowth?.toFixed(1) || '0'}%`,
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: revenue?.totalOrders?.toLocaleString() || '0',
      change: "+8.2%",
      trend: "up" as const,
      icon: Package,
    },
    {
      title: "Active Customers",
      value: customers?.totalCustomers?.toLocaleString() || '0',
      change: "+23.1%",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: `${revenue?.conversionRate?.toFixed(2) || '0'}%`,
      change: "+0.4%",
      trend: "up" as const,
      icon: TrendingUp,
    },
  ]

  const topProducts = products.slice(0, 4)
  const productStats = [
    {
      title: "Most Viewed",
      value: topProducts[0]?.name || "N/A",
      change: `${topProducts[0]?.views || 0} views`,
      trend: "up" as const,
      icon: Eye,
    },
    {
      title: "Best Seller",
      value: topProducts[0]?.name || "N/A",
      change: `${topProducts[0]?.sales || 0} sold`,
      trend: "up" as const,
      icon: ShoppingCart,
    },
    {
      title: "Top Revenue",
      value: topProducts[0]?.name || "N/A",
      change: `$${topProducts[0]?.revenue?.toLocaleString() || '0'}`,
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Best Conversion",
      value: topProducts[0]?.name || "N/A",
      change: `${topProducts[0]?.conversionRate?.toFixed(1) || '0'}%`,
      trend: "up" as const,
      icon: Star,
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
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
            <SalesChart data={dashboard?.sales} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <CategoryChart data={dashboard?.categories} />
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <ProductAnalytics data={products} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <TopProducts data={topProducts} />
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
