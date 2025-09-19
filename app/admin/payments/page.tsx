"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/contexts/redux-auth-context"
// Insert orders API hook for real backend data
import { useGetOrdersQuery } from "@/store/api/ordersApi"
// Comment unused imports
// import { useAppDispatch } from "@/store/hooks"
// import { showModal } from "@/store/slices/uiSlice"



// (dynamic paymentMethods computed with useMemo below)

export default function AdminPaymentsPage() {
  const { user, hydrated } = useAuth()
  const router = useRouter()
  // const dispatch = useAppDispatch()
  // Fetch orders (payments derive from orders)
  const { data: ordersResp, isLoading, isError } = useGetOrdersQuery({ limit: 100 })
  const [payments, setPayments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [filteredPayments, setFilteredPayments] = useState<any[]>([])

  useEffect(() => {
    if (!hydrated) return
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [hydrated, user, router])

  // Map orders to payments view-model
  useEffect(() => {
    const orders = ordersResp?.data ?? []
    const mapped = orders.map((order: any) => {
      const methodMap: Record<string, string> = {
        stripe: "Credit Card",
        credit_card: "Credit Card",
        debit_card: "Debit Card",
        paypal: "PayPal",
        cash_on_delivery: "Cash on Delivery",
      }
      const method = methodMap[order.paymentMethod] || (order.paymentMethod || "Unknown")
      const amount = Number(order.total || 0)
      const rawStatus = order.paymentStatus || "pending"
      const status = rawStatus === "paid" ? "completed" : rawStatus
      // Simple estimated fee for card/stripe; 0 otherwise
      const fees = (order.paymentMethod === "stripe" || order.paymentMethod === "credit_card") && amount
        ? Number((amount * 0.029 + 0.3).toFixed(2))
        : 0
      const net = Number((amount - fees).toFixed(2))
      return {
        id: order.id || order._id || order.orderId,
        orderId: order.orderId,
        customer: order.customerName || order.customer?.name || order.customerInfo?.name || order.shippingAddress?.fullName || "—",
        email: order.customerEmail || order.customer?.email || order.customerInfo?.email || order.shippingAddress?.email || "—",
        amount,
        method,
        status,
        date: order.createdAt,
        transactionId: order.paymentId || order.orderId,
        currency: "USD",
        fees,
        net,
      }
    })
    setPayments(mapped)
  }, [ordersResp])

  useEffect(() => {
    let filtered = payments

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (payment) =>
          payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by payment method
    if (selectedMethod !== "all") {
      filtered = filtered.filter((payment) => payment.method.toLowerCase().replace(/\s+/g, "-") === selectedMethod)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((payment) => payment.status === selectedStatus)
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date()
      const threshold = new Date(now)
      switch (dateRange) {
        case "today":
          threshold.setHours(0, 0, 0, 0)
          break
        case "week":
          threshold.setDate(now.getDate() - 7)
          break
        case "month":
          threshold.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          threshold.setMonth(now.getMonth() - 3)
          break
      }
      filtered = filtered.filter((p) => new Date(p.date) >= threshold)
    }

    setFilteredPayments(filtered)
  }, [searchQuery, selectedMethod, selectedStatus, dateRange, payments])

  const paymentMethods = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of payments) {
      const id = (p.method || "unknown").toLowerCase().replace(/\s+/g, "-")
      counts[id] = (counts[id] || 0) + 1
    }
    const list = Object.entries(counts).map(([id, count]) => ({
      id,
      name: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
    }))
    return [{ id: "all", name: "All Methods", count: payments.length }, ...list]
  }, [payments])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-300" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "refunded":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
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

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const totalFees = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + (p.fees || 0), 0)
  const netRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + (p.net ?? (p.amount - (p.fees || 0))), 0)
  const pendingAmount = payments
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0)

  if (!hydrated || !user || user.role !== "admin") {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Payment Management</h1>
              <p className="text-muted-foreground">Track and manage all payment transactions</p>
            </div>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${netRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">After fees and refunds</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${totalFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Payment processing costs</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search payments, customers, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20"
            />
          </div>

          <Select value={selectedMethod} onValueChange={setSelectedMethod}>
            <SelectTrigger className="w-48 border-primary/20">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name} ({method.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 border-primary/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48 border-primary/20">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Payments Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-4 h-11">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Payment Transactions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredPayments.length} of {payments.length} transactions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full !rounded-t-xl !overflow-hidden">
                      <thead className="border-b gradient-primary text-white !rounded-t-xl !overflow-hidden">
                        <tr className="border-b border-primary/20">
                          <th className="text-left py-3 px-4 font-medium">Transaction</th>
                          <th className="text-left py-3 px-4 font-medium">Customer</th>
                          <th className="text-left py-3 px-4 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 font-medium">Method</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Net</th>
                          <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((payment, index) => (
                          <motion.tr
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border-l-2 border-r-2 border-gray-100 ${index % 2=== 0 ? "bg-gray-50" : "bg-white"}`}
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">
                                  {payment.id?.length > 10 ? payment.id.slice(0, 10) + "..." : payment.id}
                                </p>
                                <p className="text-sm text-muted-foreground">{payment.orderId}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">{payment.customer}</p>
                                <p className="text-sm text-muted-foreground">{payment.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-medium gradient-text">${payment.amount.toLocaleString()}</span>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className="border-primary/20">
                                {payment.method}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(payment.status)}
                                <Badge variant="outline" className={getStatusColor(payment.status)}>
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`font-medium ${payment.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                                ${payment.net.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  View Details
                                </Button>
                                {payment.status === "completed" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                  >
                                    Refund
                                  </Button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.slice(1).map((method) => {
                        const percentage = payments.length ? (method.count / payments.length) * 100 : 0
                        return (
                          <div key={method.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{method.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full gradient-primary" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-12 text-right">
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Transaction Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["completed", "pending", "processing", "failed", "refunded"].map((status) => {
                        const count = payments.filter((p) => p.status === status).length
                        const percentage = payments.length ? (count / payments.length) * 100 : 0
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              <span className="text-sm font-medium capitalize">{status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full gradient-primary" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="disputes" className="mt-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Payment Disputes</CardTitle>
                  <p className="text-sm text-muted-foreground">Manage chargebacks and payment disputes</p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Disputes</h3>
                    <p className="text-muted-foreground">
                      All payment disputes have been resolved. New disputes will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
