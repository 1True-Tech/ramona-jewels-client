"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
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

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    date: "2024-03-15",
    status: "delivered",
    total: 299.99,
    items: 2,
    products: [
      { name: "Midnight Rose", image: "/placeholder.svg", quantity: 1, price: 149.99 },
      { name: "Ocean Breeze", image: "/placeholder.svg", quantity: 1, price: 150.00 }
    ],
    shippingAddress: "123 Main St, New York, NY 10001"
  },
  {
    id: "ORD-002",
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    date: "2024-03-14",
    status: "shipped",
    total: 189.99,
    items: 1,
    products: [
      { name: "Velvet Oud", image: "/placeholder.svg", quantity: 1, price: 189.99 }
    ],
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210"
  },
  {
    id: "ORD-003",
    customerName: "Carol Davis",
    customerEmail: "carol@example.com",
    date: "2024-03-13",
    status: "processing",
    total: 449.99,
    items: 3,
    products: [
      { name: "Garden Party", image: "/placeholder.svg", quantity: 1, price: 179.99 },
      { name: "Citrus Burst", image: "/placeholder.svg", quantity: 1, price: 135.00 },
      { name: "Mystic Woods", image: "/placeholder.svg", quantity: 1, price: 135.00 }
    ],
    shippingAddress: "789 Pine St, Chicago, IL 60601"
  },
  {
    id: "ORD-004",
    customerName: "David Wilson",
    customerEmail: "david@example.com",
    date: "2024-03-12",
    status: "pending",
    total: 225.00,
    items: 1,
    products: [
      { name: "Royal Amber", image: "/placeholder.svg", quantity: 1, price: 225.00 }
    ],
    shippingAddress: "321 Elm St, Miami, FL 33101"
  },
  {
    id: "ORD-005",
    customerName: "Eva Brown",
    customerEmail: "eva@example.com",
    date: "2024-03-11",
    status: "cancelled",
    total: 167.50,
    items: 1,
    products: [
      { name: "Floral Dream", image: "/placeholder.svg", quantity: 1, price: 167.50 }
    ],
    shippingAddress: "654 Maple Dr, Seattle, WA 98101"
  }
]

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "shipped": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
      case "processing": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "pending": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
      case "cancelled": return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
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
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold text-blue-600">{stats.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
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
            onChange={(e) => setDateFilter(e.target.value)}
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
          className="bg-card rounded-lg border overflow-hidden"
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-amber-300 hover:bg-muted/50">
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
                        {new Date(order.date).toLocaleDateString()}
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
                        <p className="font-medium">{order.items} items</p>
                        <p className="text-sm text-muted-foreground">
                          {order.products.slice(0, 2).map(p => p.name).join(", ")}
                          {order.products.length > 2 && ` +${order.products.length - 2} more`}
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