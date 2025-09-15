"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentOrders } from "@/components/admin/recent-orders"
import { SalesChart } from "@/components/admin/sales-chart"
import { useAuth } from "@/contexts/redux-auth-context"
import { io, Socket } from "socket.io-client"
import { useGetRevenueMetricsQuery, useGetAnalyticsDashboardQuery, useGetInventoryInsightsQuery } from "@/store/api/analyticsApi"
import { useGetUserStatsQuery } from "@/store/api/adminApi"

// Ensure stat entries have the correct trend literal union
type DashStat = {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
}

export default function AdminDashboard() {
  const { user, hydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router, hydrated])

  // ===== Live data wiring (APIs + Socket.IO) =====
  const skipQueries = !hydrated || !user || user.role !== "admin"

  const { data: revenueResp } = useGetRevenueMetricsQuery(undefined, {
    skip: skipQueries,
    refetchOnMountOrArgChange: true,
  })
  const { data: dashboardResp } = useGetAnalyticsDashboardQuery(undefined, {
    skip: skipQueries,
    refetchOnMountOrArgChange: true,
  })
  const { data: userStatsResp } = useGetUserStatsQuery(undefined, {
    skip: skipQueries,
    refetchOnMountOrArgChange: true,
  })
  const { data: inventoryResp } = useGetInventoryInsightsQuery(undefined, {
    skip: skipQueries,
    refetchOnMountOrArgChange: true,
  })

  const [live, setLive] = useState<any | null>(null)

  useEffect(() => {
    if (skipQueries) return

    const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000", {
      transports: ["websocket"],
    })

    socket.emit("join_analytics")

    const onUpdate = (payload: any) => {
      setLive(payload)
    }

    socket.on("analytics_update", onUpdate)

    return () => {
      try { socket.emit("leave_analytics") } catch {}
      try {
        socket.off("analytics_update", onUpdate)
        socket.disconnect()
      } catch {}
    }
  }, [skipQueries])

  const revenue = useMemo(() => (live?.revenue ? live.revenue : revenueResp?.data), [live, revenueResp]) as any
  const totalProducts = useMemo(
    () => (
      (live?.inventory?.totalProducts ??
      inventoryResp?.data?.totalProducts ??
      dashboardResp?.data?.inventory?.totalProducts ??
      0)
    ),
    [live, inventoryResp, dashboardResp]
  )
  const activeUsers = useMemo(
    () => (typeof live?.activeUsers === "number" ? live.activeUsers : userStatsResp?.data?.active ?? 0),
    [live, userStatsResp]
  )

  const stats = useMemo<DashStat[]>(() => {
    const revenueTotal = Number(revenue?.totalRevenue ?? 0)
    const ordersTotal = Number(revenue?.totalOrders ?? 0)

    const revenueGrowth = typeof revenue?.revenueGrowth === "number" ? revenue.revenueGrowth : 0
    const ordersGrowth = typeof (revenue as any)?.ordersGrowth === "number" ? (revenue as any).ordersGrowth : 0

    const revenueChange = `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(1)}%`
    const ordersChange = `${ordersGrowth >= 0 ? "+" : ""}${ordersGrowth.toFixed(1)}%`

    return [
      {
        title: "Total Revenue",
        value: `$${revenueTotal.toLocaleString()}`,
        change: revenueChange,
        trend: revenueGrowth < 0 ? "down" : "up",
        icon: DollarSign,
      },
      {
        title: "Orders",
        value: `${ordersTotal.toLocaleString()}`,
        change: ordersChange,
        trend: ordersGrowth < 0 ? "down" : "up",
        icon: ShoppingCart,
      },
      {
        title: "Products",
        value: `${Number(totalProducts).toLocaleString()}`,
        change: "+0.0%",
        trend: "up",
        icon: Package,
      },
      {
        title: "Active Users",
        value: `${Number(activeUsers).toLocaleString()}`,
        change: "+0.0%",
        trend: "up",
        icon: Users,
      },
    ]
  }, [revenue, totalProducts, activeUsers])

  if (!hydrated) {
    return null
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here's what's happening with your store.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
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
        </motion.div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <SalesChart />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <RecentOrders />
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
