"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/redux-auth-context"
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { 
  useGetOrdersQuery,
  useGetOrderStatsQuery
} from "@/store/api/ordersApi"
import { 
  Search, 
  Filter, 
  Eye, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  ShoppingCart,
  Calendar,
} from "lucide-react"


export default function AdminOrdersPage() {
  const { user, hydrated } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
  
  // Helper to derive start/end dates from dateFilter
  const getDateRange = (filter: "all" | "today" | "week" | "month") => {
    const now = new Date()
    let start: string | undefined
    let end: string | undefined
    switch (filter) {
      case "today": {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        start = startOfDay.toISOString()
        end = endOfDay.toISOString()
        break
      }
      case "week": {
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - 7)
        start = startOfWeek.toISOString()
        end = now.toISOString()
        break
      }
      case "month": {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        start = startOfMonth.toISOString()
        end = now.toISOString()
        break
      }
      default:
        start = undefined
        end = undefined
    }
    return { startDate: start, endDate: end }
  }

  const { startDate, endDate } = getDateRange(dateFilter)

  const isAdmin = !!user && user.role === "admin"
  const skipQueries = !hydrated || !isAdmin
  
  const { data: ordersResponse, isLoading: ordersLoading, error: ordersError } = useGetOrdersQuery({
     ...(searchQuery ? { search: searchQuery } : {}),
     ...(selectedStatus === "all" ? {} : { status: selectedStatus }),
     ...(startDate ? { startDate } : {}),
     ...(endDate ? { endDate } : {})
   }, { skip: skipQueries, refetchOnMountOrArgChange: true })
   
   const { data: statsResponse, isLoading: statsLoading } = useGetOrderStatsQuery(undefined, { skip: skipQueries, refetchOnMountOrArgChange: true })
   
   const orders = ordersResponse?.data || []
   const stats = statsResponse?.data
  // removed unused mutations

  useEffect(() => {
    if (!hydrated) return
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, hydrated, router])

  if (!hydrated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  if (ordersLoading || statsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (ordersError) {
    const err: any = ordersError as any
    const message = err?.data?.message || err?.error || 'Error loading orders. Please try again.'
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">
          {message}
        </div>
      </AdminLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-500 bg-green-50"
      case "shipped": return "text-blue-500 bg-blue-50"
      case "processing": return "text-yellow-500 bg-yellow-50"
      case "pending": return "text-orange-300 bg-orange-50 border-none"
      case "cancelled": return "text-red-500 bg-red-50"
      default: return "text-gray-500 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "shipped": return <Truck className="h-4 w-4" />
      case "processing": return <Package className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "cancelled": return <XCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        >
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(0) || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-500">{stats?.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.processing || 0}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.shipped || 0}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats?.delivered || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as "all" | "today" | "week" | "month")}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </motion.div>

        {/* Orders Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b gradient-primary text-white">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Order</th>
                  <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Customer</th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Items</th>
                  <th className="text-left py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className={`border-l-2 border-r-2 border-gray-100 ${idx % 2=== 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="py-4 px-4"> 
                      <div>
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                          {order.id}
                        </Link>
                        <p className="text-sm text-muted-foreground sm:hidden">
                          {order.customerName}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div>
                        <p className="font-medium">{order.items.length} items</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.slice(0, 2).map((i: any) => i.name).join(", ")}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}