"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

// Mock payment data
const mockPayments = [
  {
    id: "pay_001",
    orderId: "ORD-2024-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    amount: 2499.99,
    method: "Credit Card",
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    transactionId: "txn_1234567890",
    currency: "USD",
    fees: 72.5,
    net: 2427.49,
  },
  {
    id: "pay_002",
    orderId: "ORD-2024-002",
    customer: "Michael Chen",
    email: "michael@example.com",
    amount: 1899.99,
    method: "PayPal",
    status: "pending",
    date: "2024-01-15T09:15:00Z",
    transactionId: "txn_0987654321",
    currency: "USD",
    fees: 55.1,
    net: 1844.89,
  },
  {
    id: "pay_003",
    orderId: "ORD-2024-003",
    customer: "Emily Rodriguez",
    email: "emily@example.com",
    amount: 129.99,
    method: "Apple Pay",
    status: "failed",
    date: "2024-01-14T16:45:00Z",
    transactionId: "txn_1122334455",
    currency: "USD",
    fees: 0,
    net: 0,
  },
  {
    id: "pay_004",
    orderId: "ORD-2024-004",
    customer: "David Wilson",
    email: "david@example.com",
    amount: 3299.99,
    method: "Bank Transfer",
    status: "processing",
    date: "2024-01-14T14:20:00Z",
    transactionId: "txn_5566778899",
    currency: "USD",
    fees: 15.0,
    net: 3284.99,
  },
  {
    id: "pay_005",
    orderId: "ORD-2024-005",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    amount: 899.99,
    method: "Credit Card",
    status: "refunded",
    date: "2024-01-13T11:10:00Z",
    transactionId: "txn_9988776655",
    currency: "USD",
    fees: -26.1,
    net: -873.89,
  },
]

const paymentMethods = [
  { id: "all", name: "All Methods", count: mockPayments.length },
  { id: "credit-card", name: "Credit Card", count: 2 },
  { id: "paypal", name: "PayPal", count: 1 },
  { id: "apple-pay", name: "Apple Pay", count: 1 },
  { id: "bank-transfer", name: "Bank Transfer", count: 1 },
]

export default function AdminPaymentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [payments, setPayments] = useState(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [filteredPayments, setFilteredPayments] = useState(mockPayments)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

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
      filtered = filtered.filter((payment) => payment.method.toLowerCase().replace(" ", "-") === selectedMethod)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((payment) => payment.status === selectedStatus)
    }

    setFilteredPayments(filtered)
  }, [searchQuery, selectedMethod, selectedStatus, payments])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
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
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "refunded":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const totalFees = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.fees, 0)
  const netRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.net, 0)
  const pendingAmount = payments
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0)

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-playfair gradient-text">Payment Management</h1>
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
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
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
                    <table className="w-full">
                      <thead>
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
                            className="border-b border-primary/10 hover:bg-muted/50"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">{payment.transactionId}</p>
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
                        const percentage = (method.count / mockPayments.length) * 100
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
                        const percentage = (count / payments.length) * 100
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
